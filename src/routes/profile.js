const profileController = require('../controllers/profileController');
const express = require('express');

const auth = require('../controllers/authController');

const router = express.Router();

router.put('/update-password',auth.protect, profileController.updatePassword);  // update user password

router.put('/update-username',auth.protect, profileController.updateUsername);  // update user name


router.put('/update-bio',auth.protect, profileController.updateBio);  // update user bio 


router.get('/get-personal-info',auth.protect, profileController.getPersonalInformations);  // get user profile inf


module.exports = router;
