const config = require("../config");

const Sequelize = require("sequelize");

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
const sequelize = new Sequelize(config.db.db_url, {
  dialect: "postgres",
  protocol: "postgres",
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

//! Define Models
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

//! Tables Relations
// User & Subscription (One -> Many)
UserModal.hasMany(SubscriptionModal, { foreignKey: "userId" });
SubscriptionModal.belongsTo(UserModal, { foreignKey: "userId" });

// User & University (Many -> Many)
UserModal.belongsToMany(UniversityModal, { through: UserUniversityModal });
UniversityModal.belongsToMany(UserModal, { through: UserUniversityModal });

// User & Locaiton (one -> one)
UserModal.hasOne(LocationModal);
LocationModal.belongsTo(UserModal);

//* University and CourseOfferingModal (One -> Many)
UniversityModal.hasMany(CourseOfferingModal);
CourseOfferingModal.belongsTo(UniversityModal);

//* Class and Exam (One -> Many)
ClassModal.hasMany(ExamModal);
ExamModal.belongsTo(ClassModal);

//* CourseOffering & Semester (One -> Many)
SemesterModal.hasMany(CourseOfferingModal);
CourseOfferingModal.belongsTo(SemesterModal);

//* CourseOffering & Course (One -> One)
CourseModal.hasMany(CourseOfferingModal);
CourseOfferingModal.belongsTo(CourseModal);

//* CourseOffering & User ( Many -> Many ) through UserCourseOffering
CourseOfferingModal.belongsToMany(UserModal, {
  through: UserCourseOfferingModal,
});
UserModal.belongsToMany(CourseOfferingModal, {
  through: UserCourseOfferingModal,
});

//* Class & UserCourseOfferingModal (One -> Many)
UserCourseOfferingModal.hasMany(ClassModal);
ClassModal.belongsTo(UserCourseOfferingModal);

// Class & Student ( Many -> Many )
StudentModal.belongsToMany(ClassModal, { through: EnrollmentModal });
ClassModal.belongsToMany(StudentModal, { through: EnrollmentModal });

// University & Student (One -> Many)
UniversityModal.hasMany(StudentModal);
StudentModal.belongsTo(UniversityModal);
/*
foreignKey: {
    name: 'universityId',
    primaryKey: true,
  },
*/

//! Direct relationship between Student and Enrollment
StudentModal.hasOne(EnrollmentModal);
EnrollmentModal.belongsTo(StudentModal);

// Grade & Exam (One -> Many)
ExamModal.hasMany(GradeModal);
GradeModal.belongsTo(ExamModal);

// Grade & Enrollment (One -> One)
// every enrollment(student) has one grade and every grade has one enrollment(student)
EnrollmentModal.hasOne(GradeModal);
GradeModal.belongsTo(EnrollmentModal);

// User & Activity (One -> Many)
// we use in user activity tracing
UserModal.hasMany(ActivityModal);
ActivityModal.belongsTo(UserModal);

// Plan & Subscription (One -> Many)
PlanModal.hasMany(SubscriptionModal, { foreignKey: "planId" });
SubscriptionModal.belongsTo(PlanModal, { foreignKey: "planId" });

// Payment & Subscription (One -> One)
SubscriptionModal.hasMany(PaymentModal, { foreignKey: "subscriptionId" });
PaymentModal.belongsTo(SubscriptionModal, { foreignKey: "subscriptionId" });

//************End of Table Relations Section************/
module.exports = sequelize;
