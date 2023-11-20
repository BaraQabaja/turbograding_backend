// route /api/auth

const rateLimit = require("express-rate-limit");
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
 
//is limiter especially for login
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit to 5 login attempts
//   message: 'too many login attempts. Please try again later.',
// });

router.post('/register', authController.registerUser);  // Registration route
router.post('/login', authController.loginUser);  // Login route
router.post('/forgot-password', authController.forgotPassword);  // Forgot password route - 1st step in forget password process
router.post('/verifyPasswordResetCode', authController.verifyPasswordResetCode);  // verify password reset code that was sent to email - 2nd step in forget password process
router.post('/reset-password', authController.resetPassword);  // Reset password route - 3ed step in forget password process

router.post('/logout',authController.protect,authController.logoutUser);// Logout route

// Express route to handle verification
router.get("/verify/:token",authController.emailVerification );//email verification
//router.post('/token', authController.refreshToken);
//router.post('/confirm-email', authController.confirmEmail);

/*
app.post('/refresh', async (req, res) => {
    const refreshToken = req.body.token;
  
    if (!refreshToken) return res.sendStatus(401);
  
    const savedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
  
    if (!savedToken) return res.sendStatus(403);
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
  
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      res.json({ accessToken });
    });
  });
  
*/
module.exports = router;
