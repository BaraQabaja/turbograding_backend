const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

const config = require("../config");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");

// @desc    Get all Subscriptions logic
// @route   GET /api/admin/get-all-Subscriptions
// @access  admin
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [
        {
          model: Plan,
        },
        { model: User },
      ],
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order
    });
    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "Subscriptions fetched successfully.", subscriptions: subscriptions },
    });
  } catch (error) {
    console.log("get Subscriptions error ===> ", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Something went wrong, please try again.",
      },
    });
  }
};
