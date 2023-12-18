const Plan = require("../models/Plan");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");


// @desc    Get all plans logic
// @route   GET /api/payment/get-all-plans
// @access  anyone (public info)
exports.getPlans = async (req, res) => {
    try {
      const plans = await Plan.findAll({where:{
        status:'active'
      }});
      return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { title: "plans fetched successfully.", plans: plans },
      });
    } catch (error) {
      return res.status(500).json({
        status: httpStatusText.ERROR,
        data: {
          title: error.message || "Something went wrong, please try again.",
        },
      });
    }
  };

