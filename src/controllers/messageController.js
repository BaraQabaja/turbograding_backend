const Message = require("../models/Message");
const validator = require("validator");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");

// @desc    send message logic
// @route   POST /api/public/send-message
// @access  anyone (public info)
exports.sendMessage = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  try {
    const maxLengthName = 50;
    const minLengthName = 2;
    const maxLengthMessage = 10;
    const minLengthMessage = 500;
    if (firstName.length > maxLengthName || firstName.length < maxLengthName) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: `Invalid first name length. Maximum length is ${maxLengthName} and Minimum length is ${minLengthName} characters.`,
        },
      });
    }
    if (lastName.length > maxLengthName || lastName.length < maxLengthName) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: `Invalid last name length. Maximum length is ${maxLengthName} and Minimum length is ${minLengthName} characters.`,
        },
      });
    }
    const isValid = await validator.isEmail(email);
    if (!isValid) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { title: "you entered invalid email" },
      });
    }

    if (
      message.length > maxLengthMessage ||
      message.length < minLengthMessage
    ) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: `Invalid message length. Maximum length is ${maxLengthMessage} and Minimum length is ${minLengthMessage} characters.`,
        },
      });
    }
    
    await Message.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      message: message,
    });

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { title: "message sent successfully." },
    });
  } catch (error) {
    console.log("error in sending the message ==> ", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Something went wrong, please try again.",
      },
    });
  }
};
