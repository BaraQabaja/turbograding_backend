const jwt = require('jsonwebtoken');
const config = require('../config/index');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("token:::" + token);
  if (!token) {
    return res.sendStatus(401);  // if there isn't any token
  }

  jwt.verify(token, config.auth.accessToken , (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();  // pass the execution off to whatever request the client intended
  });
}

module.exports = authenticateToken;
