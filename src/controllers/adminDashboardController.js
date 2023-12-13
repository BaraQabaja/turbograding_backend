const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

const config = require("../config");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");

// @desc    Get all Users logic
// @route   GET /api/admin/get-all-Users
// @access  admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: "teacher",
      },

      include: {
        model: Subscription,

        include: {
          model: Plan,
        },
        order: [["createdAt", "DESC"]], // Order by createdAt in descending order
        limit: 1, // Limit the result to only the latest subscription
      },
    });
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { title: "Users fetched successfully.", users: users },
    });
  } catch (error) {
    console.log("getUsers error ===> ", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Something went wrong, please try again.",
      },
    });
  }
};

// @desc    Get all plans logic
// @route   DELETE /api/admin/delete-plan?planId=number
// @access  admin
exports.deletePlan = async (req, res) => {
  const id = req.query.planId; // Get the plan ID from URL query
  // const universityName = req.query.universityName;

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: { title: "plan not found" },
      });
    }
    await plan.destroy();
    const remainingPlans = await Plan.findAll();
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { title: "Plan deleted successfully", plans: remainingPlans },
    });
  } catch (error) {
    return res.status(500).json({
      status: httpStatusText.FAIL,
      data: { title: error.message || "something went wrong,please try again" },
    });
  }
};
