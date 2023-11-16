const config = require("../config");
const bcrypt = require("bcrypt");
//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");
//models
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

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
    const newUsername = req.body.newUsername;

    const isValidUsername = /^[a-zA-Z0-9_]+$/.test(newUsername);
    if (!isValidUsername) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title:
            "Invalid username. Username can only contain letters, numbers, and underscores.",
        },
      });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    user.username = newUsername;
    await user.save();

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "Username updated successfully." },
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
          title: `Invalid bio length. Maximum length is ${maxBioLength} and Minimum length is ${maxBioLength} characters.`,
        },
      });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    user.about = newBio;
    await user.save();

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "Bio updated successfully." },
    });
  } catch (error) {
    console.error("Error updating Bio:", error.message);
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
    const userJoinDate = user.createdAt;
    const userBio = user.about;
    const userFirstName = user.firstName;
    const userLastName = user.lastName;
    const userEmail = user.email;

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

    const subscriptionEndDate = latestSubscription.endDate;
    subscriptionEndDate = new Date(subscriptionEndDate);
    subscriptionEndDate = subscriptionEndDate.toISOString().slice(0, 10);

    const subscriptionPlanId = latestSubscription.planId;

    // 3) find user plan via planId
    const plan = await Plan.findByPk(subscriptionPlanId);
    //  needed data from plan object
    const planName = plan.name;
    const planNumberOfExamsLimit = plan.exams;
    const planNumberOfQuestionsLimit = plan.questions;

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
          subscriptionStartDate,
          subscriptionEndDate,
          planName,
          planNumberOfExamsLimit,
          planNumberOfQuestionsLimit,
        },
      },
    });
  } catch (error) {
    console.error("Error finding user data :", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Something went wrong please try again.",
      },
    });
  }
};
