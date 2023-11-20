const xss = require('xss');

function xssMiddleware(req, res, next) {
    // Sanitize request body
    req.body = sanitizeData(req.body);
  
    // Sanitize request query parameters
    req.query = sanitizeData(req.query);
  
    next();
  }
  
  // Function to recursively sanitize data
  function sanitizeData(data) {
    if (typeof data === 'object') {
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          data[key] = sanitizeData(data[key]);
        }
      }
    } else if (typeof data === 'string') {
      data = xss(data);
    }
  
    return data;
  }
  
  module.exports = xssMiddleware;