// routes/ user
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../controllers/authController');
const customController=require('../controllers/customController')
// const express = require('express');
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
// const authenticateToken = require('../middleware/authenticateToken');
// // const usersController = require('../controllers/UserController');

// const router = express.Router();
// const storage = multer.diskStorage({
//     destination: "./uploads/",
//     filename: function (req, file, cb) {
//         cb(null, uuidv4() + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage: storage });


router.post('/grading-exam',auth.protect, userController.gradingExam);
router.get('/get-user-universities',auth.protect, userController.getUserUniversities);
router.get('/get-user-courses',auth.protect, userController.getUserCourses);
router.get('/get-semesters',auth.protect, userController.getSemesters);
router.get('/get-user-classes',auth.protect, userController.getUserClasses);
router.get('/students-exam-info',auth.protect, userController.getStudentsExamInfo);
router.post('/user/custom-grade',auth.protect, customController.postCustomGrade)// set a custom grade to students

router.post('/user/custom-feedback',auth.protect, customController.postCustomFeedback)// set a custom feedback to students

router.post('/user/custom-ai-instruction',auth.protect, customController.postCustomAiInstruction)// set a custom instruction to students
// // ... more routes ...

module.exports = router;
