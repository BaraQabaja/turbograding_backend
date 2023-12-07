const config=require("../config")
const jwt = require('jsonwebtoken');

const createToken = (userId) =>
  jwt.sign({ userId: userId }, config.auth.accessToken, {
    expiresIn: config.auth.expire_time,
  });

module.exports = createToken;