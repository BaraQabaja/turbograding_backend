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
  console.log(req.body);

  try {
    const info = req.body;
    const {
      course_code,
      course_name,
      university_name,
      semester,
      class_code,
      studentId,
      studentFirstName,
      studentLastName,
    } = info;
    // 1) Create Course
    //check if the course exist or not
    const course = await Course.findOne({
      where: { course_code: course_code },
    });
    // if not exist create the course
    if (!course) {
      await Course.create({
        course_code: course_code,
        course_name: course_name,
      });
    }

    // 2) Create University
    //check if the university exist or not
    const university = await University.findOne({
      where: { university_name: university_name },
    });
    // if not exist create the university
    if (!university) {
      await University.create({
        university_name: university_name,
      });
    }
    // 3) Create userUniversity
    // - get university_name to access the university id
    const university_intity = await University.findOne({
      where: {
        university_name: university_name,
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
    // check if the userUniversity is exist or not, if the professor is working at this university or not
    const userUniversity = await UserUniversity.findOne({
      where: { universityId: university_intity.id, UserId: req.user.id },
    });

    if (!userUniversity) {
      // - create the userUniversity
      await UserUniversity.create({
        universityId: university_intity.id,
        UserId: req.user.id,
      });
    }

    // 4) Create CourseOffering
    // - get the course id we want to offer
    const course_intity = await Course.findOne({
      where: {
        course_code: course_code,
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

    // check if the course offered or not
    const courseOffering = await CourseOffering.findOne({
      where: {
        semester_name: semester,
        class_code: class_code,
        courseId: course_intity.id,
        UserId: req.user.id,
      },
    });
    if (!courseOffering) {
      // - create the courseOffering
      await CourseOffering.create({
        semester_name: semester,
        class_code: class_code,
        courseId: course_intity.id,
        UserId: req.user.id,
      });
    }

    // 5) Create Student
    // check if the student exist or not
    const student = await Student.findOne({
      where: {
        id: info.studentId,
        first_name: studentFirstName,
        last_name: studentLastName,
        universityId: university_intity.id,
      },
    });
    if (!student) {
      // create student
      await Student.create({
        id: info.studentId,
        first_name: studentFirstName,
        last_name: studentLastName,
        universityId: university_intity.id,
      });
    }
    // 6) Create Enrollment for this student on specific course(offered course)
    // - get the courseOffering id (the id of the offeredCourse we just created in step 4)

    const courseOffering_intity = await CourseOffering.findOne({
      where: {
        //we match all these attributes because every attribute can be changed while other attributes still fixed
        semester_name: semester,
        class_code: class_code,
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
    // check if the student enrolled in the courseoffering or not
    const enrollment = await Enrollment.findOne({
      where: {
        courseOfferingId: courseOffering_intity.id,
        studentId: studentId,
      },
    });

    if (!enrollment) {
      // - create the courseOffering
      await Enrollment.create({
        courseOfferingId: courseOffering_intity.id,
        studentId: studentId,
      });
    }

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
    console.log("error happend in gradingExam ==> ", error);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        title: "Something went wrong, please try again.",
      },
    });
  }
};

















