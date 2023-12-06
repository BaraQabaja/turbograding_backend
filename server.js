// Standard libraries
const config = require("./src/config");
const rateLimit = require("express-rate-limit");
const express = require("express");
const pdfParse = require("pdf-parse");
const http = require("http");
const https = require("https");
const path = require("path");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const { webhookCheckout } = require("./src/controllers/paymentController");
//const { Configuration, OpenAIApi } = require("openai");
const jwt = require("jsonwebtoken");
//for thired party login
const passport = require("passport");
const passportJWT = require("passport-jwt");
const compression = require("compression");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const auth = require("./src/controllers/authController");
var xss = require("xss"); // to prevent xss attach - related to sql injection attack

//! (Security) rate limiting middleware for all operations
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//! Diclirations
const app = express();
// Specify allowed origins
const allowedOrigins = [
  "http://localhost:3000/*",
  "http://localhost:3000",
  "chrome-extension://pfgjachlphejjkgnenknlbhncljapfia",
  "http://127.0.0.1:5500/*",
  "http://127.0.0.1:5500"
  // Add your frontend URL
  // 'https://yourproductionfrontendurl.com', // Add your production frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("cors origin ===> ", origin);
    console.log("allowedOrigins chrome extention ===> ", allowedOrigins);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Enable CORS with specific options
app.use(cors(corsOptions));

/*const configuration = new Configuration({
    apiKey: config.api.gpt_key,
});*/
//const openai = new OpenAIApi(configuration);

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: config.auth.accessToken,
};

// let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
//     console.log('payload received', jwt_payload);

//     if (jwt_payload) {
//         // The following will ensure that all routes using
//         // passport.authenticate have a req.user._id, req.user.userName, req.user.fullName & req.user.role values
//         // that matches the request payload data
//         next(null, { userId: jwt_payload.userId, firstName: jwt_payload.firstName, lastName: jwt_payload.lastName });
//     } else {
//         next(null, false);
//     }
// });
// passport.use(strategy);

//! Checkout webhook  (stripe related)
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//! Middleware
app.use(compression()); // Compress all responses
app.use(bodyparser.urlencoded({ extended: false }));
app.use(passport.initialize());

require("./src/utils/subscriptionScheduler"); // Include the subscription scheduler code performed every day at 0.0 am to make sure that the user subscription endDate is expired or not based on that he will update the subscription status to inactive or he will leave it active as it is.

require("./src/utils/basicSubscriptionScheduler"); // Include the basic subscription scheduler code performed begin of the month to update remainingQuestions, remainingExams and remainingAssignments

//! environment setup

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//! Increase payload limit to 10MB
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//! xss attack prevention
// Middleware to sanitize all incoming request data
app.use((req, res, next) => {
  console.log("entered the xss middleware ===> ", req.body);
  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      console.log("req.body[key] before ====> ", req.body[key]);
      req.body[key] = xss(req.body[key]);
      console.log("req.body[key] after ====> ", req.body[key]);
    }
  }
  next();
});

//! GPT fucntion
// const gptFunctions = require('./src/middleware/gpt');

//! Database
const sequelize = require("./src/models/database");

//! Routes End points
const userRoutes = require("./src/routes/user");
const authRoutes = require("./src/routes/auth");
const subscriptionRoutes = require("./src/routes/subscription");
const paymentRoutes = require("./src/routes/payment");
const planRoutes = require("./src/routes/plan");
const profileRoutes = require("./src/routes/profile");

//! Middlewares
app.use(express.static("public"));
//apply requests limiter as a middleware, to limit the incomming requests rate
// app.use("/api", limiter);

//! Routes
// app.use('/api/users', usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/user", userRoutes);

//! Modals
const UserModal = require("./src/models/User");
const UniversityModal = require("./src/models/University");
const UserUniversityModal = require("./src/models/UserUniversity");
const CourseModal = require("./src/models/Course");
const ActivityModal = require("./src/models/Activity");
// const CourseOfferingSemesterModal = require("./src/models/CourseOfferingSemester");
const SemesterModal = require("./src/models/Semester");
const ClassModal = require("./src/models/Class_Info");
const LocationModal = require("./src/models/Location_Info");

const StudentModal = require("./src/models/Student");
const CourseOfferingModal = require("./src/models/CourseOffering");
const UserCourseOfferingModal = require("./src/models/UserCourseOffering");

const EnrollmentModal = require("./src/models/Enrollment");

const GradeModal = require("./src/models/Grade");
const ExamModal = require("./src/models/Exam");

const PaymentModal = require("./src/models/Payment");
const PlanModal = require("./src/models/Plan");
const SubscriptionModal = require("./src/models/Subscription");

// references: {
//   model: 'users',
//   key: 'id'
// }
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


//* CourseOffering & Semester (One -> Many)
SemesterModal.hasMany(CourseOfferingModal);
CourseOfferingModal.belongsTo(SemesterModal);

//* CourseOffering & Course (One -> One)
CourseModal.hasMany(CourseOfferingModal);
CourseOfferingModal.belongsTo(CourseModal);

//* CourseOffering & User ( Many -> Many ) through UserCourseOffering
CourseOfferingModal.belongsToMany(UserModal, { through: UserCourseOfferingModal });
UserModal.belongsToMany(CourseOfferingModal, { through: UserCourseOfferingModal });

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


const PORT = process.env.PORT || 5000; //port number

app.all("*", (req, res, next) => {
  res.status(400).send(`Can't find this route: ${req.originalUrl}`);
});
//! On Production
const HOSTProduction = "0.0.0.0"; //production
sequelize
  .sync() //keep this in your mind { force: true } { alter: true }
  .then(() => {
    console.log("DB Sync Done Successfully!");
    app.listen(process.env.PORT || 5000, HOSTProduction, () => {
      console.log(`Server is listening on  ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to Sync with DB: ${err.message}`);
  });

//On Development
// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("DB Sync Done Successfully!");
//     app.listen(PORT, process.env.HOST, () => {
//       console.log(`Server is listening on http://${ process.env.HOST}:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(`Failed to Sync with DB: ${err.message}`);
//   });
/**
   
sequelize
  .sync({ forse: true })
  .then(() => {
    console.log("DB Sync Done Successfully!");
    app.listen(process.env.PORT, process.env.HOST, () => {
      console.log(`Server is listening on http://${ process.env.HOST}:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to Sync with DB: ${err.message}`);
  });


   */
// listen on ports HTTP_PORT and HTTPS_PORT.
// db.sync().then(() => {
//     http.createServer(app).listen(config.app.http_port, () => { console.log("Express http server listening"); });
//     https.createServer(config.https_options, app).listen(config.app.https_port, () => { console.log("Express https server listening "); });
// }).catch(err => console.log(err))
