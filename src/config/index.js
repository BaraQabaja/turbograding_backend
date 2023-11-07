const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });const fs = require('fs');
console.log(process.env.HTTP_PORT)
module.exports = {
  app: {
    http_port: process.env.HTTP_PORT,
    https_port: process.env.HTTPS_PORT
  },
  db: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  auth: {
    accessToken : process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
  },
  api: {
    gpt_key: process.env.GPT_KEY,
  },
  ssl: {
    key_file: "./ssl_key/server.key",
    crt_file: "./ssl_key/server.crt"
  },
  https_options:{
    key: fs.readFileSync(__dirname +  "/ssl_key/server.key"),
    cert: fs.readFileSync(__dirname + "/ssl_key/server.crt")
  }
};

 
 