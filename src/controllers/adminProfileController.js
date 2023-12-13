const httpStatusText = require("../utils/httpStatusText");
//models
const User = require("../models/User");

// @desc     Get profile info
// @route    Get /api/admin/get-personal-info
// @access   protected/admin
exports.getPersonalInformation = async (req, res) => {
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
    // console.log("userimg", userImg);

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
