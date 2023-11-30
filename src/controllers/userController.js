const config = require("../config");

// Required Controllers
const Course = require("../models/Course");
const University = require("../models/University");
const UserUniversity = require("../models/UserUniversity");
const CourseOffering = require("../models/CourseOffering");
const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");
const Exam = require("../models/Exam");
const Grade = require("../models/Grade");

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");

// @desc    Get all user grading info
// @route   GET /api/user/grading-exam
// @access  private / user
exports.gradingExam = async (req, res) => {
  console.log("user info recieved ===> ");
  console.log(req.body.data);

  try {
    const info = req.body.data;
    // 1) Create Course
    const course = await Course.create({
      course_code: info.course_code,
      course_name: info.course_name,
    });

    // 2) Create University
    const university = await University.create({
      univesity_name: info.univesity_name,
    });

    // 3) Create userUniversity
    // - get university_name to access the university id
    const university_intity = await University.findOne({
      where: {
        univesity_name: info.univesity_name,
      },
    });
    if (!university_intity) {
        console.log("fail finding university");

      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: "University that you are looking for is not exist.",
        },
      });
    }
    // - create the userUniversity
    const userUniversity = await UserUniversity.create({
      universityId: university_intity.id,
      UserId: req.user.id,
    });

    // 4) Create CourseOffering
    // - get the course id we want to offer
    const course_intity = await Course.findOne({
      where: {
        course_code: info.course_code,
      },
    });
    if (!course_intity) {
        console.log("fail finding course");

      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: "The Course that you are looking for is not exist.",
        },
      });
    }
    // - create the courseOffering
    const courseOffering = await CourseOffering.create({
      semester_name: info.semester_name,
      class_code: info.class_code,
      courseId: course_intity.id,
      UserId: req.user.id,
    });
    // 5) Create Student
    const student = await Student.create({
      id: info.studentId,
      first_name: info.semester_name,
      last_name: info.class_code,
      universityId: university_intity.id,
    });
    // 6) Create Enrollment for this student on specific course
    // - get the courseOffering id (the id of the offeredCourse we just created in step 4)
    const courseOffering_intity = await CourseOffering.findOne({
      where: {//we match all these attributes because every attribute can be changed while other attributes still fixed
        semester_name: info.semester_name,
        class_code: info.class_code,
        courseId: course_intity.id,
        UserId: req.user.id,
      },
    });
    if (!courseOffering_intity) {
        console.log("fail finding courseOffering");
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: "The Course that you are looking for is not Offered.",
        },
      });
    }
    // - create the courseOffering
    const enrollment = await Enrollment.create({
     courseOfferingId:courseOffering_intity.id,
     studentId:info.studentId
    });
    // // 7) Create Exam
    // const exam = await Exam.create({
    //   id: info.studentId,
    //   first_name: info.semester_name,
    //   last_name: info.class_code,
    //   universityId: university_intity.id,
    // });
    // // 8) Create Grade
    // const grade = await Grade.create({
    //   id: info.studentId,
    //   first_name: info.semester_name,
    //   last_name: info.class_code,
    //   universityId: university_intity.id,
    // });

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        title: "user data stored successfully.",
      },
    });
  } catch (error) {
    console.log("error happend in gradingExam ==> ", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Something went wrong, please try again.",
      },
    });
  }
};
