const crypto = require("crypto");
const config = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const { Op, DATE } = require("sequelize");
const validator = require("validator");
const stripe = require("stripe")(config.payment_stripe.stripe_secret);
//send email function
const sendEmail = require("../utils/sendEmail");

// create token functions
const createToken = require("../utils/createToken");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");

//models
const User = require("../models/User");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");

// @desc    Protect logic (verify token issue) authinticaion middleware
exports.protect = async (req, res, next) => {
  console.log("i am in protect function");
  //Check if token sent with req or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else {
  //      return res.status(404).json({
  //       status: httpStatusText.FAIL,
  //       data: { title: "please send a token to verify you" },
  //     });
  // }

  console.log("token", token);
  if (!token) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "You are not login, Please login to get access this route",
      },
    });
  }

  // 2) Verify token (no change happens, expired token)
  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, config.auth.accessToken);
  } catch (error) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "Token is invalid, please login." },
    });
  }
  // 3) Check if user exists
  const currentUser = await User.findByPk(decoded.userId);
  if (!currentUser) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "The user that belong to this token does no longer exist",
      },
    });
  }

  if (currentUser.logoutAt) {
    const logoutAt = parseInt(currentUser.logoutAt.getTime() / 1000, 10);
    if (logoutAt > decoded.iat) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { title: "you recently logout. please login again." },
      });
    }
  }

  //! So importent, here i store user data into req object so i can retrive this data in any function then, ex: req.user.id ....
  req.user = currentUser;
  next();
};

exports.emailVerification = async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({ where: { emailVerificationToken: token } });
  if (!user) {
    return res.json({
      statsu: httpStatusText.FAIL,
      data: { title: "Invalid token" },
    });
  }
  user.verifiedEmail = true;
  user.emailVerificationToken = undefined;
  await user.save();
  return res.json({
    statsu: httpStatusText.SUCCESS,
    data: { title: "Account verified successfully" },
  });
};

// @desc    Logout logic
// @route   POST /api/auth/logout
// @access  private/user
exports.logoutUser = async (req, res) => {
  console.log("i am in logout user controller");
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.logoutAt = Date.now(); //change the logoutAt attripute to be Date.now() so that allow you to check the time that the user logedout so if he entered to any unotharized page and send a request or do any thing he will be forworded to login page, i will use this property in protect function
      await user.save();
      return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { title: "You logout successfully." },
      });
    }
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: { title: "something went wrong, please try again" },
    });
  } catch (error) {
    console.log("logout error : ", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: { title: "something went wrong, please try again" },
    });
  }
};

// @desc    Register user logic, create new user
// @route   POST /auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  //12 is the number of rounds of hashing. so the password hashing process is more computationally expensive and therefore more secure against brute-force attacks.

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  console.log("signup", email, password);

  //check if the password and confirm password is matched or not
  if (password !== confirmPassword) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "password and confirmation password must be the same" },
    });
  }
  //check if the user email not valid or not valid (email syntax check) - prev sql injection
  const isValid = await validator.isEmail(email);
  if (!isValid) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "you entered invalid email" },
    });
  }

  //check if the user email is in the db or not
  const isExistEmail = await User.findOne({
    where: { email },
  });
  // const isVerified=isExistEmail.verifiedEmail
  if (isExistEmail && isExistEmail.verifiedEmail) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "email already registered" },
    });
  }
  if (isExistEmail && !isExistEmail.verifiedEmail) {
    await User.destroy({
      where: { email: email },
    });
  }

  //check password length
  if (password.length < 8) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "password length less than 8 characters" },
    });
  }

  const customer = await stripe.customers.create({
    email,
  });

  console.log("customer id ==> ", customer.id);
  console.log("user in");

  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      if (hashPassword) {
        //create new user with the given data
        User.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashPassword,
          verifiedEmail: false,
          joinDate: Date.now(),
          stripeCustomerId: customer.id,
        })
          .then(async (user) => {
            if (user) {
              console.log("user out", user);
              //verify
              const randomCode = crypto.randomBytes(20).toString("hex");

              // Save the token to the user's record in the database after registration
              // This assumes you have a User model and a field for verificationToken
              const token = randomCode;
              user.emailVerificationToken = token;
              await user.save();
              try {
                //${req.protocole}://${req.get('host')}/orders
                console.log(
                  `${req.protocole}://${req.get("host")}/verify/${token}`
                );
                const verificationLink = `http://localhost:3000/verify/${token}`; //! for now keep it like this, when you want to deploy the app you should change it to be   const verificationLink = `${req.protocole}://${req.get('host')}/verify/${token}`;

                await sendEmail({
                  email: user.email,
                  subject: "Account Verification",
                  content: `Click <a href="${verificationLink}">here</a> to verify your account.`,
                });
              } catch (error) {
                user.emailVerificationToken = null;

                await user.save();

                return res.json({
                  status: httpStatusText.ERROR,
                  data: { title: "email not sent", message: error.message },
                });
              }
              // Create basic subscription for the user
              // 1) Find plan - from function parameters
              const plan = await Plan.findOne({
                where: { name: "basic" },
              });
              const planId = plan.id;
              // 2) Create sub
              const subscriptionEnd_ms = 99999999999 * 1000;
              //convert from seconds to milliseconds
              const subscriptionStart_ms = 100 * 1000;
              //convert from seconds to milliseconds
              try {
                const subscription = await Subscription.create({
                  userId: user.id,
                  planId: planId,
                  startDate: new Date(subscriptionStart_ms),
                  endDate: new Date(subscriptionEnd_ms),
                  status: "active",
                  remainingQuestions: plan.questions,
                  remainingExams: plan.exams,
                  remainingAssignments: plan.assignments,
                });

                console.log("subscription created successfully.", subscription);
              } catch (error) {
                console.log(error.message);
                return res.status(500).json({
                  status: httpStatusText.FAIL,
                  data: { title: "registration failed" },
                });
              }

              return res.status(200).json({
                status: httpStatusText.SUCCESS,
                data: {
                  title:
                    "email verification link sent to your email, please check your inbox.",
                  stripeCustomerId: customer.id,
                },
              });

              // return res.status(200).json({
              //   status: httpStatusText.SUCCESS,
              //   data: { title: "registration successful" },
              // });
            } else {
              return res.status(400).json({
                status: httpStatusText.FAIL,
                data: { title: "registration failed" },
              });
            }
          })
          .catch((err) => {
            return res
              .status(500)
              .send(err || "Something went wrong in the db");
          });
      } else {
        return res.send("something went wrong in returning hash password");
      }
    })
    .catch((err) => {
      return res.status(500).send(err || "Something went wrong");
    });
};

// @desc    Login logic with authorization JWT
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("email prev xss attack ====> ", email);
  //***Email validation - prev sql injection***
  const isValid = await validator.isEmail(email);
  if (!isValid) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "you entered invalid email" },
    });
  }

  try {
    const user = await User.findOne({ where: { email } });
    console.log("user exist", password);
    if (!user) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { title: "incorrect email or password" },
      });
    }

    // Compaire hash(login pass) to hash (db user password hash)

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      console.log("incorpass", correctPassword);

      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { title: "incorrect email or password" },
      });
    }

    //   const token = createToken(userId: user.id, firstName: user.firstName, lastName: user.lastName ); //Bara code
    //   const refreshToken= createRefreshToken(userId: user.id, firstName: user.firstName, lastName: user.lastName )
    // User is authenticated, issue a token
    const token = jwt.sign(
      { userId: user.id, firstName: user.firstName, lastName: user.lastName },
      config.auth.accessToken,
      { expiresIn: "7d" /*'15m'*/ }
    );

    const refreshTokenValue = jwt.sign(
      { userId: user.id, firstName: user.firstName, lastName: user.lastName },
      config.auth.refreshToken,
      { expiresIn: "7d" }
    );

    // Send the token to the client
    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "logged in successfully", user: user },
      token,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: httpStatusText.ERROR, data: { title: error.message } });
  }
  /* const refreshToken = await RefreshToken.create({
         token: refreshTokenValue,
         userId: user.id // assuming user is your Sequelize user instance
     });*/
};

// @desc    forget pass logic,send verification code to email - 1st step in forget password process
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  //1) Get user by email
  const email = req.body.email;
  const user = await User.findByPk(email);
  if (!user) {
    return res.json({
      status: httpStatusText.FAIL,
      data: { title: "there is no user with that email", email: email },
    });
  }

  //2) If user exist Generate reset random 6 digits and save in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashedResetCode into db
  user.passwordResetCode = hashedResetCode;

  // Add expiration time for reset code (10 min)
  user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save(); // await to save the user changes

  //3) Send the reset code via email
  // const content=`Hi ${user.username}, We received a request to reset the password `
  const text = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello, ${user.username}</p>
        <p>We have received a request to reset your password. Your password reset code is:</p>
        <p style="background-color: #f4f4f4; padding: 10px; font-size: 20px;">${resetCode}</p>
        <p>If you didn't request a password reset, please ignore this email or contact our support team.</p>
        <p>Thank you!</p>
    </div>
</body>
</html>`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      content: text,
    });
  } catch (error) {
    user.passwordResetCode = null;
    user.passwordResetExpire = null;
    user.passwordResetVerified = null;
    await user.save();

    return res.json({
      status: httpStatusText.ERROR,
      data: { title: "email not sent", message: error.message },
    });
  }

  return res.json({
    status: httpStatusText.SUCCESS,
    data: { title: "Reset code sent to your email. Check your inbox." },
  });
};

// @desc    Verify the code sent to your email - 2nd step in forget password process
// @route   POST /api/verifyPasswordResetCode
// @access  Public
exports.verifyPasswordResetCode = async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    where: {
      passwordResetCode: hashedResetCode,
      passwordResetExpire: {
        [Op.gt]: new Date(), // Check if the reset expiration is in the future
      },
    },
  });
  if (!user) {
    return res.json({
      status: httpStatusText.FAIL,
      data: { title: "reset code invalid" },
    });
  }

  // 2) Reset code valid

  user.passwordResetVerified = true;
  await user.save();
  return res.json({
    status: httpStatusText.SUCCESS,
    data: { title: "reset code verified" },
  });
};

// @desc    Reset password - 3ed step in forget passwrod process
// @route   PUT /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  //********Validation********
  //check if the password and confirm password is matched or not
  if (password !== confirmPassword) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "password and confirmation password must be the same" },
    });
  }

  //check password length
  if (password.length < 8 || confirmPassword.length < 8) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "password length should be equal or more than 8 characters",
      },
    });
  }

  //check if the user email not valid or not valid (email syntax check) - prev sql injection
  const isValid = await validator.isEmail(email);
  if (!isValid) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "you entered invalid email" },
    });
  }
  //***************************

  // 1) Get user based on email
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { title: "there is no user with this email" },
    });
  }

  // 2) check if reset code verified
  if (!user.passwordResetVerified) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: { title: "reset code not verified" },
    });
  }
  // Reset the password
  try {
    // - Encrypt the new password

    const encryptPassword = await bcrypt.hash(req.body.password, 12);
    user.password = encryptPassword;
    user.passwordResetCode = null;
    user.passwordResetExpire = null;
    user.passwordResetVerified = null;
    await user.save();

    // 3) everything is ok
    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "Password changed successfully" },
    });
  } catch (error) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: { title: "Something went wrong, please try again." },
    });
  }
};
