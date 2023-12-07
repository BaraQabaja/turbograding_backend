const config = require('../config');

const Sequelize = require('sequelize');
// ... Other imports
const {
  UserModal,
  UniversityModal,
  UserUniversityModal,
  CourseModal,
  ActivityModal,
  SemesterModal,
  ClassModal,
  LocationModal,
  StudentModal,
  CourseOfferingModal,
  UserCourseOfferingModal,
  EnrollmentModal,
  GradeModal,
  ExamModal,
  PaymentModal,
  PlanModal,
  SubscriptionModal,
} = require("./index");
//! on Development
// const sequelize = new Sequelize(
//     config.db.database,
//     config.db.username,
//     config.db.password,
//     {
//         host: config.db.host,
//         dialect: 'postgres',
//         port: 5432, //should be remove
//         dialectOptions: {
//             // ssl: { rejectUnauthorized: false }
//         } //should be remove
//     });

//! on production
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // <<<<<<< This is important
      },
    },
    pool: {
      max: 20, // Adjust as needed
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // other configurations...
  });
//! Modals
const UserModal = require("./User");
const UniversityModal = require("./University");
const UserUniversityModal = require("./UserUniversity");
const CourseModal = require("./Course");
const ActivityModal = require("./Activity");
// const CourseOfferingSemesterModal = require("./src/models/CourseOfferingSemester");
const SemesterModal = require("./Semester");
const ClassModal = require("./Class_Info");
const LocationModal = require("./Location_Info");

const StudentModal = require("./Student");
const CourseOfferingModal = require("./CourseOffering");
const UserCourseOfferingModal = require("./UserCourseOffering");

const EnrollmentModal = require("./Enrollment");

const GradeModal = require("./Grade");
const ExamModal = require("./Exam");

const PaymentModal = require("./Payment");
const PlanModal = require("./Plan");
const SubscriptionModal = require("./Subscription");


module.exports = {sequelize,   UserModal,
  UniversityModal,
  UserUniversityModal,
  CourseModal,
  ActivityModal,
  SemesterModal,
ClassModal,
LocationModal,
StudentModal,
CourseOfferingModal,
UserCourseOfferingModal,
EnrollmentModal,
GradeModal,
ExamModal,
PaymentModal,
PlanModal,
SubscriptionModal,};

