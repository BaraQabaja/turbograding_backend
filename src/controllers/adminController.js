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


// @desc    Register admin logic, create new user with role admin
// @route   POST /auth/admin
// @access  admin
exports.adminRegister = async (req, res) => {
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
  
    // const customer = await stripe.customers.create({
    //   email,
    // });
  
    // console.log("customer id ==> ", customer.id);
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
            role:'admin'
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
                  // console.log(
                  //   `${req.protocole}://${req.get("host")}/verify/${token}`
                  // );
                  const verificationLink = `http://localhost:3000/verify/${token}`; //! for now keep it like this, when you want to deploy the app you should change it to be   const verificationLink = `${req.protocole}://${req.get('host')}/verify/${token}`;
  
                //   // Create basic subscription for the user
                //   // 1) Find plan - from function parameters
                //   const plan = await Plan.findOne({
                //     where: { name: "basic" },
                //   });
                //   if (!plan) {
                //     return res.status(404).json({
                //       status: httpStatusText.FAIL,
                //       data: { title: "something went wrong, please try again." },
                //     });
                //   }
                //   const planId = plan.id;
                //   // 2) Create sub
                //   const subscriptionEnd_ms = 99999999999 * 1000;
                //   //convert from seconds to milliseconds
                //   const subscriptionStart_ms = 100 * 1000;
                //   //convert from seconds to milliseconds
                //   try {
                //     const subscription = await Subscription.create({
                //       userId: user.id,
                //       planId: planId,
                //       startDate: new Date(subscriptionStart_ms),
                //       endDate: new Date(subscriptionEnd_ms),
                //       status: "active",
                //       remainingQuestions: plan.questions,
                //       remainingExams: plan.exams,
                //       remainingAssignments: plan.assignments,
                //     });
  
                //     console.log(
                //       "subscription created successfully.",
                //       subscription
                //     );
                //   } catch (error) {
                //     console.log("regestration error");
  
                //     console.log(error.message);
                //     return res.status(500).json({
                //       status: httpStatusText.FAIL,
                //       data: { title: "registration failed" },
                //     });
                //   }
                  // 2) send email
                  await sendEmail({
                    email: user.email,
                    subject: "Account Verification",
                    content: `Click <a href="${verificationLink}">here</a> to verify your account.`,
                  });
                } catch (error) {
                  console.log(
                    "error in user regesteration ====> ",
                    error.message
                  );
                  user.emailVerificationToken = null;
  
                  await user.save();
  
                  return res.json({
                    status: httpStatusText.ERROR,
                    data: {
                      title:
                        "email not sent, something went wrong please try again.",
                      message: error.message,
                    },
                  });
                }
  
                return res.json({
                  status: httpStatusText.SUCCESS,
                  data: {
                    title:
                      "email verification link sent to your email, please check your inbox."
                  },
                });
  
                // return res.status(200).json({
                //   status: httpStatusText.SUCCESS,
                //   data: { title: "registration successful" },
                // });
              } else {
                return res.status(400).json({
                  status: httpStatusText.FAIL,
                  data: { title: "Registration failed, please try again" },
                });
              }
            })
            .catch((error) => {
              console.log("Something went wrong in the db ===> ", error);
              return res.status(500).json({
                status: httpStatusText.FAIL,
                data: { title: "Something went wrong, please try again." },
              });
            });
        } else {
          return res.json({
            status: httpStatusText.FAIL,
            data: { title: "Something went wrong, please try again." },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          status: httpStatusText.FAIL,
          data: { title: "Something went wrong, please try again." },
        });
      });
  };