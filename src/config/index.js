const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const fs = require("fs");
console.log(process.env.HTTP_PORT);
module.exports = {
  app: {
    http_port: process.env.HTTP_PORT,
    https_port: process.env.HTTPS_PORT,
    host:process.env.HOST,
    PORT:process.env.PORT,
  },
  client:{//front-end url, at this time the url will be the localhost url
    url:process.env.CLIENT_URL
  },
  db: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    db_url: process.env.DATABASE_URL,
    db_port: process.env.DB_PORT
  },
  auth: {
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
    expire_time:process.env.JWT_EXPIRE_TIME

  },
  api: {
    gpt_key: process.env.GPT_KEY,
  },
 
  ssl: {
    key_file: "./ssl_key/server.key",
    crt_file: "./ssl_key/server.crt",
  },
  https_options: {
    key: fs.readFileSync(__dirname + "/ssl_key/server.key"),
    cert: fs.readFileSync(__dirname + "/ssl_key/server.crt"),
  },
  payment_stripe: {
    stripe_secret: process.env.STRIPE_SECRET,
    signing_secret: process.env.SIGNING_SECRET,
  },
  email:{
    email_host:process.env.EMAIL_HOST,
    email_port:process.env.EMAIL_PORT,
    email_user:process.env.EMAIL_USER,
    email_password:process.env.EMAIL_PASSWORD,
  },
  
};
