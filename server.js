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
//const { Configuration, OpenAIApi } = require("openai");
const jwt = require("jsonwebtoken");
//for thired party login
const passport = require("passport");
const passportJWT = require("passport-jwt");
const compression=require('compression')
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

//! (Security) rate limiting middleware for all operations
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//! Diclirations
const app = express();

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

//! Middleware
app.use(cors());
app.use(compression());// Compress all responses
app.use(bodyparser.urlencoded({ extended: false }));
app.use(passport.initialize());

//! environment setup
const PORT = process.env.PORT || 5000; //port number
const HOST = process.env.HOST || "127.0.0.1"; //host domain
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//! Increase payload limit to 10MB
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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

//! Middlewares
app.use(express.static("public"));
//apply requests limiter as a middleware, to limit the incomming requests rate
app.use("/api", limiter);

//! Routes
// app.use('/api/users', usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/plan", planRoutes);

//! Modals
const UserModal = require("./src/models/User");
const PaymentModal = require("./src/models/Payment");
const PlanModal = require("./src/models/Plan");
const SubscriptionModal = require("./src/models/Subscription");

//! Tables Relations
// User Relations
UserModal.hasMany(SubscriptionModal, { foreignKey: "userId" });
SubscriptionModal.belongsTo(UserModal, { foreignKey: "userId" });

// Payment Relations
PaymentModal.belongsTo(SubscriptionModal, { foreignKey: "subscriptionId" });

// Plan Relations
PlanModal.hasMany(SubscriptionModal, { foreignKey: "planId" });

// Subscription Relations
SubscriptionModal.belongsTo(UserModal, { foreignKey: 'userId' });
SubscriptionModal.belongsTo(PlanModal, { foreignKey: 'planId' });
SubscriptionModal.hasMany(PaymentModal, { foreignKey: 'subscriptionId' });


app.all("*", (req, res, next) => {
  res.status(400).send(`Can't find this route: ${req.originalUrl}`);
});

sequelize
  .sync({ forse: true })
  .then(() => {
    console.log("DB Sync Done Successfully!");
    app.listen(PORT, HOST, () => {
      console.log(`Server is listening on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to Sync with DB: ${err.message}`);
  });

// listen on ports HTTP_PORT and HTTPS_PORT.
// db.sync().then(() => {
//     http.createServer(app).listen(config.app.http_port, () => { console.log("Express http server listening"); });
//     https.createServer(config.https_options, app).listen(config.app.https_port, () => { console.log("Express https server listening "); });
// }).catch(err => console.log(err))
