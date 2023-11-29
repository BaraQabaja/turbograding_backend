const config = require("../config");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");



// @desc    Get all plans logic
// @route   GET /api/user/grading-exam
// @access  private / user
exports.gradingExam = async (req, res) => {
    console.log("user info recieved ===> ")
    console.log(req.body)

//   try {
//     const plans = await Plan.findAll();
//     return res.status(200).json({
//       status: httpStatusText.SUCCESS,
//       data: plans,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: httpStatusText.ERROR,
//       data: {
//         title: error.message || "Something went wrong, please try again.",
//       },
//     });
//   }
};


