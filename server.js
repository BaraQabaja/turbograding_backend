// Standard libraries
const config = require('./src/config');

const express = require('express');
const pdfParse = require('pdf-parse');

const http = require("http");
const https = require("https");
const path = require("path");
const cheerio = require('cheerio');
const axios = require('axios');
const cors = require("cors");
const bodyparser = require("body-parser");
//const { Configuration, OpenAIApi } = require("openai");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

// Diclirations
const app = express();


/*const configuration = new Configuration({
    apiKey: config.api.gpt_key,
});*/
//const openai = new OpenAIApi(configuration);

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.auth.accessToken ,
};

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);

    if (jwt_payload) {
        // The following will ensure that all routes using 
        // passport.authenticate have a req.user._id, req.user.userName, req.user.fullName & req.user.role values 
        // that matches the request payload data
        next(null, { userId: jwt_payload.userId, firstName: jwt_payload.firstName, lastName: jwt_payload.lastName });
    } else {
        next(null, false);
    }
});
passport.use(strategy);

// Middleware
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(passport.initialize());

// Increase payload limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//GPT fucntion
const gptFunctions = require('./src/middleware/gpt');


// Database
const db = require('./src/models/database');


// Routes
const usersRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const subscriptionsRoutes = require('./src/routes/subscriptions');
const paymentsRoutes = require('./src/routes/payments');
const plansRoutes = require('./src/routes/plans');

// Use middleware
app.use(express.static('public'));


// Use routes
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/subscriptions', subscriptionsRoutes);
app.use('/payments', paymentsRoutes);
app.use('/plans', plansRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});



// listen on ports HTTP_PORT and HTTPS_PORT. 
db.sync().then(() => {
    http.createServer(app).listen(config.app.http_port, () => { console.log("Express http server listening"); });
    https.createServer(config.https_options, app).listen(config.app.https_port, () => { console.log("Express https server listening "); });
}).catch(err => console.log(err))

