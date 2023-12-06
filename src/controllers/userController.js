const config = require("../config");

// Required Controllers
const Course = require("../models/Course");
const Semester = require("../models/Semester");

const University = require("../models/University");
const UserUniversity = require("../models/UserUniversity");
const CourseOffering = require("../models/CourseOffering");
const UserCourseOffering = require("../models/UserCourseOffering");

const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");
const Exam = require("../models/Exam");
const Grade = require("../models/Grade");
const Class = require("../models/Class_Info");
const User = require("../models/User");

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
    const university_entity = await University.findOne({
      where: {
        university_name: university_name,
      },
    });
    if (!university_entity) {
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
      where: { universityId: university_entity.id, UserId: req.user.id },
    });

    if (!userUniversity) {
      // - create the userUniversity
      await UserUniversity.create({
        universityId: university_entity.id,
        UserId: req.user.id,
      });
    }
    // 4) Create Semester
    // check if semester is exist or not
    const semester_entity = await Semester.findOne({
      where: {
        Semester_name: semester,
      },
    });
    if (!semester_entity) {
      // - create the semester
      await Semester.create({
        Semester_name: semester,
      });
    }
    // 5) Create CourseOffering
    // - get the course id we want to offer
    const course_entity = await Course.findOne({
      where: {
        course_code: course_code,
      },
    });
    if (!course_entity) {
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
        SemesterId: semester_entity.id,
        courseId: course_entity.id,
        UserId: req.user.id,
      },
    });
    if (!courseOffering) {
      // - create the courseOffering
      await CourseOffering.create({
        SemesterId: semester_entity.id,
        class_code: class_code,
        courseId: course_entity.id,
        UserId: req.user.id,
      });
    }

    // 6) Create Class
    // check if the class exist or not
    const class_info_entity = await Class.findOne({
      where: {
        class_code: class_code,
      },
    });
    const courseOffering_for_class = await CourseOffering.findOne({
      where: {
        SemesterId: semester_entity.id,
        courseId: course_entity.id,
        UserId: req.user.id,
      },
    });
    if (!class_info_entity) {
      // - create the class
      await Class.create({
        class_code: class_code,
        courseOfferingId: courseOffering_for_class.id,
      });
    }

    // 7) Create Student

    const university_for_student = await University.findOne({
      where: {
        university_name: university_name,
      },
    });
    if (!university_for_student) {
      console.log("fail finding university");
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: "The University that you are looking for is not exist.",
        },
      });
    }
    // check if the student exist or not
    const student_check = await Student.findOne({
      where: {
        id: studentId,
        first_name: studentFirstName,
        last_name: studentLastName,
        universityId: university_for_student.id,
      },
    });
    if (!student_check) {
      // create student
      await Student.create({
        id: studentId,
        first_name: studentFirstName,
        last_name: studentLastName,
        universityId: university_entity.id,
      });
    }
    // 8) Create Enrollment - for this student on specific class that related to specific course(offered course)

    //check if student is exist or not
    const student_for_enrollment = await Student.findByPk(studentId);
    if (!student_for_enrollment) {
      console.log("fail finding the student");
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: "The student that you are looking for is not exist.",
        },
      });
    }

    const class_for_enrollment = await Class.findOne({
      where: {
        class_code: class_code,
      },
    });
    if (!class_for_enrollment) {
      console.log("fail finding the class");
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: "The class that you are looking for is not exist.",
        },
      });
    }
    // check if the student enrolled in the class that related to specific course or not
    const enrollment = await Enrollment.findOne({
      where: {
        ClassInfoId: class_for_enrollment.id,
        studentId: studentId,
      },
    });

    if (!enrollment) {
      // - create the enrollment for this student
      await Enrollment.create({
        ClassInfoId: class_for_enrollment.id,
        studentId: studentId,
      });
    }

    // // 10) Create Exam
    // const exam = await Exam.create({
    //   id: info.studentId,
    //   first_name: info.semester_name,
    //   last_name: info.class_code,
    //   universityId: university_intity.id,
    // });
    // // 11) Create Grade
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

// @desc    Get user universities logic - universities related to a spicific user
// @route   GET /api/user/get-user-universities
// @access  private - user
exports.getUserUniversities = async (req, res) => {
  const userId = req.user.id;
  try {
    const userUniversities = await User.findByPk(userId, {
      include: {
        model: University,
        through: UserUniversity, // This is important for a many-to-many association
        attributes: ["id", "university_name"], // Specify the attributes you want to retrieve
      },
    });
    console.log("the uni found ===> ");
    console.log(userUniversities);
if(!userUniversities){
  return res.json({
    status: httpStatusText.FAIL,
    data: { title: "no universities" },
  });
}
    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "university found.", userUniversities },
    });
  } catch (error) {
    console.log("error in getUserUniversities ===> ", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: { title: "something went wrong, please try again." },
    });
  }
};

// @desc    Get user university courses - courses related to a spicific university
// @route   GET /api/user/get-user-courses
// @access  private - user
exports.getUserCourses = async (req, res) => {
  try {
    // 1) User id
    const userId = req.user.id;
    // Get the university name from the query parameter
    const universityName = req.query.universityName;
    let semesterName = req.query.semesterName;
    console.log("semesterName ====> ", semesterName);
    if (semesterName == "default") {
      const latestSemester = await Semester.findOne({
        order: [["createdAt", "DESC"]], // Order by createdAt in descending order
      });

      if (latestSemester) {
        semesterName = latestSemester.Semester_name;
      } else {
        return res.json({
          status: httpStatusText.FAIL,
          data: { title: "no semesters" },
        });
      }
    }
    // const semesterName = '23U';

    console.log("university name ===>", universityName);
    // 2) university id
    // Find the university based on the name
    const university = await University.findOne({
      where: { university_name: universityName },
    });

    if (!university) {
      return res.json({
        status: httpStatusText.FAIL,
        data: { title: "no universities" },
      });
    }
    // 3) semester id
    // Find the semester
    const semester = await Semester.findOne({
      where: { Semester_name: semesterName },
    });

    if (!semester) {
      return res.json({
        status: httpStatusText.FAIL,
        data: { title: "no semesteres" },
      });
    }

    // 4) find couseOffered IDs for specific user
    const user_courses = await User.findByPk(userId, {
      include: {
        model: CourseOffering,
        where: {
          universityId: university.id,
          SemesterId: semester.id,
        },
        attributes: ["courseId"],
        through: {
          model: UserCourseOffering,
          where: {},
          attributes: ["UserId", "courseOfferingId"],
        },
        include: {
          model: Course,
          // attributes: ["courseId"],
        },
      },
      attributes: [],
    });
    console.log("user_courses");
    console.log(user_courses);

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "Courses found successfully.", user_courses },
    });
  } catch (error) {
    console.log("error in getUserCourses controller ===> ", error.message);
    return res.json({
      status: httpStatusText.ERROR,
      data: { title: "Error finding courses, please try again." },
    });
  }
};

// @desc    Get all semesters
// @route   GET /api/user/get-semesters
// @access  private - user
exports.getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.findAll();
    if (!semesters) {
      return res.json({
        status: httpStatusText.FAIL,
        data: { title: "no semester"},
      });
    }
    console.log("semesters", semesters);

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { title: "semesters found successfully.", semesters: semesters },
    });
  } catch (error) {
    console.log("error in getSemesters ===> ", error.message);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      data: { title: "something went wrong, please try again." },
    });
  }
};
