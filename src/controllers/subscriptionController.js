const Subscription = require("../models/Subscription");
const config = require("../config");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");

// @desc    Create user subscription logic
// @route   POST /api/subscription/create-subscription
// @access  admin
exports.createSubscription = async (req, res) => {
  const { userId, planId, startDate, status,stripeCustomerId } = req.body;
  try {
    const subscription = await Subscription.create({
      userId,
      planId,
      startDate,
      endDate,
      status,
      stripeCustomerId,
    });
    return res.status(201).json(subscription);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Get user subscription logic - subscription related to a spicific user
// @route   GET /api/subscription/get-subscription/:userId
// @access  admin
exports.getUserSubscription = async (req, res) => {
  const userId = req.params.userId; // Get the plan ID from URL parameters
  try {
    const userSubscription = await Subscription.findOne({ where: { userId } });

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "user found.", userSubscription },
    });
  } catch (error) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: { title: error.message || "user subscription not found." },
    });
  }
};

// @desc    Get all subscriptions logic
// @route   GET /api/subscription/get-all-subscriptions
// @access  admin
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll();
    if (!subscriptions) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: { title: "no subscriptions yet" },
      });
    }

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "all subscriptions", subscriptions },
    });
  } catch (error) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: error.message || "something went wrong, please try again.",
      },
    });
  }
};
