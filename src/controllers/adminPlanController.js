const Plan = require("../models/Plan");
const config = require("../config");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");


// @desc    Create plan logic
// @route   POST /api/admin/create-plan
// @access  admin
exports.createPlan = async (req, res) => {
  const { name, description, price,currency, duration, questions, assignments,exams, priceId } =
    req.body;
  try {
    const plan = await Plan.create({
      name,
      description,
      price,
      currency,
      duration,
      questions,
      assignments,
      exams,
      priceId,
    });

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { title: "Plan created successfully.", plan },
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


// @desc    Get all plans logic
// @route   GET /api/admin/get-all-plans
// @access  admin
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll();
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data:{title:"plans fetched successfully.", plans:plans},
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


// @desc    Get all plans logic
// @route   DELETE /api/admin/delete-plan?planId=number
// @access  admin
exports.deletePlan = async (req, res) => {
  const  id  = req.query.planId; // Get the plan ID from URL query 
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
      data: { title: "Plan deleted successfully" ,plans:remainingPlans},
    });

  } catch (error) {
    return res.status(500).json({
      status: httpStatusText.FAIL,
      data: { title: error.message || "something went wrong,please try again" },
    });
  }
};


// @desc    Update plan logic
// @route   Put /api/admin/update-plan/:id
// @access  admin
exports.updatePlan = async (req, res) => {
  const  id  = req.params.id; // Get the plan ID from URL parameters
  const { name, description, price,currency, duration, questions, assignments,exams, priceId } =
  req.body;
  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: { title: "plan not found." },
      });
    }
    await plan.update({
      name,
      description,
      price,
      currency,
      duration,
      questions,
      assignments,
      exams,
      priceId,
    });
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { title: "Plan updated successfully" },
    });
  } catch (error) {
    return res.status(500).json({
      status: httpStatusText.FAIL,
      data: { title: error.message || "something went wrong,please try again" },
    });
  }
};
