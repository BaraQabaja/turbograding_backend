const config = require("../config");
const bcrypt = require("bcrypt");
//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");
//models
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const stripe = require("stripe")(config.payment_stripe.stripe_secret);

// @desc     Update password - new password
// @route    PUT /api/profile/update-password
// @access   protected/user
exports.updatePassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    //********Validation********
    //check if the password and confirm password is matched or not
    if (password !== confirmPassword) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { title: "Password and confirmation password must be the same." },
      });
    }

    //check password length
    if (password.length < 8 || confirmPassword.length < 8) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: {
          title: "Password length should be equal or more than 8 characters.",
        },
      });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);

    const encryptPassword = await bcrypt.hash(req.body.password, 12);
    user.password = encryptPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "Password changed successfully" },
    });
  } catch (error) {
    console.log("error updating password", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Something went wrong, please try again.",
      },
    });
  }
};

// @desc     Update username
// @route    PUT /api/profile/update-username
// @access   protected/user
exports.updateUsername = async (req, res, next) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const isValidFirstName = /^[a-zA-Z0-9_]+$/.test(firstName);
    const isValidLastName = /^[a-zA-Z0-9_]+$/.test(lastName);
    if (!isValidFirstName || !isValidLastName) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title:
            "Invalid First Name or Last Name. names can only contain letters, numbers, and underscores.",
        },
      });
    }
    // if (!isValidLastName) {
    //   return res.status(400).json({
    //     status: httpStatusText.FAIL,
    //     data: {
    //       title:
    //         "Invalid Last Name. names can only contain letters, numbers, and underscores.",
    //     },
    //   });
    // }

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "Username updated successfully.",username:{
        firstname:user.firstName,
        lastname:user.lastName
      } },
    });
  } catch (error) {
    console.error("Error updating username:", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Error updating username. Please try again.",
      },
    });
  }
};

// @desc     Update bio
// @route    PUT /api/profile/update-bio
// @access   protected/user
exports.updateBio = async (req, res, next) => {
  try {
    const newBio = req.body.newBio;
    const maxBioLength = 200;
    const minBioLength = 10;
    if (newBio.length > maxBioLength || newBio.length < minBioLength) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: `Invalid bio length. Maximum length is ${maxBioLength} and Minimum length is ${minBioLength} characters.`,
        },
      });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    user.about = newBio;
    await user.save();

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "Bio updated successfully.", newBio: newBio },
    });
  } catch (error) {
    console.log("Error updating Bio:", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Error updating Bio. Please try again.",
      },
    });
  }
};

// @desc     Get profile info from multi models - user model - plan model - subscription model
// @route    Get /api/profile/get-personal-info
// @access   protected/user
exports.getPersonalInformations = async (req, res) => {
  try {
    // 1) user info via userId
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    // needed data from user object
    let userJoinDate = user.createdAt;
    userJoinDate = new Date(userJoinDate); //to convert from 2023-11-16T11:34:44.077Z to 2023-11-16
    userJoinDate = userJoinDate.toISOString().slice(0, 10);
    const userBio = user.about;
    const userFirstName = user.firstName;
    const userLastName = user.lastName;
    const userEmail = user.email;
    const userImg = user.img;
    const userRole=user.role
    console.log("userimg", userImg);
    // 2) latest user subscription via userId - the latest will be determined based on createdAt attribute
    const latestSubscription = await Subscription.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order
    });
    // needed data from subscription object
    const subscriptionStatus = latestSubscription.status;
    let subscriptionStartDate = latestSubscription.startDate;
    subscriptionStartDate = new Date(subscriptionStartDate);
    subscriptionStartDate = subscriptionStartDate.toISOString().slice(0, 10);

    let subscriptionEndDate = latestSubscription.endDate;
    subscriptionEndDate = new Date(subscriptionEndDate);
    subscriptionEndDate = subscriptionEndDate.toISOString().slice(0, 10);

    const remaining_questions = latestSubscription.remainingQuestions;
    const remaining_exams = latestSubscription.remainingExams;
    const remaining_assignments = latestSubscription.remainingAssignments;

    const subscriptionPlanId = latestSubscription.planId;

    // 3) find user plann via planId
    const plan = await Plan.findByPk(subscriptionPlanId);
    //  needed data from plan object
    const planName = plan.name;
    const planNumberOfExamsLimit = plan.exams;
    const planNumberOfQuestionsLimit = plan.questions;
    const planNumberOfAssignmentsLimit = plan.assignments;
    return res.json({
      status: httpStatusText.SUCCESS,
      data: {
        title: "User profile data",
        profile: {
          userFirstName,
          userLastName,
          userJoinDate,
          userBio,
          userEmail,
          userImg,
          userRole,
          subscriptionStartDate,
          subscriptionEndDate,
          subscriptionStatus,
          planName,
          planNumberOfExamsLimit,
          planNumberOfQuestionsLimit,
          planNumberOfAssignmentsLimit,
          remaining_questions,
          remaining_exams,
          remaining_assignments,
        },
      },
    });
  } catch (error) {
    console.error("Error finding user data:", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Something went wrong please try again.",
      },
    });
  }
};

// @desc     Get all user subscritpions
// @route    GET /api/profile/get-user-subscriptions
// @access   protected/user
exports.userSubscriptionLog = async (req, res, next) => {
  // try {
  //   const userSubscription = await Subscription.findAll({ where: { userId } });

  // return res.json({
  //   status: httpStatusText.SUCCESS,
  //   data: { title: "user found.", userSubscription },
  // });
  // } catch (error) {
  //   return res.status(500).json({
  //     status: httpStatusText.ERROR,
  //     data: { title: error.message || "user subscription not found." },
  //   });
  // }
  // const stripeId=req.user.stripeCustomerId
  // console.log("user stripe id ===> ",stripeId)
  //  const subscriptions = await stripe.subscriptions.list({
  //     customer: stripeId,
  //     status: "all",
  //     expand: ["data.default_payment_method"],
  //   });
  //   console.log("user subscriptions ===> ", subscriptions.data[0].plan);

  const userId = req.user.id;

  try {
    const userSubscriptions = await User.findByPk(userId, {
      include: [
        {
          model: Subscription,
          
          include: [
            {
              model: Plan,
              attributes: ["name", "currency", "price"],
            },
          ],
          order: [["createdAt", "ASC"]], // Order by createdAt in descending order
          attributes: ["startDate","endDate"],
        },
      ],
    });

    if (!userSubscriptions) {
      // User not found
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { title: "user not found." },
      });
    }

    // Extract relevant data
    const subscriptionsData = userSubscriptions.Subscriptions.map(
      (subscription) => ({
        startDate: subscription.startDate,
        endDate:subscription.endDate,
        plan: {
          name: subscription.Plan.name,
          currency: subscription.Plan.currency,
          price: subscription.Plan.price,
        },
      })
    );
    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "subscriptions found.", subscriptionsData },
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: { title: "Error fetching user subscriptions" },
    });
   
  }
};
