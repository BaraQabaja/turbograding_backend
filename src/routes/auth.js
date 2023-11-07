// routes/auth.js

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
 

router.post('/register', authController.registerUser);  // Registration route
router.post('/login', authController.loginUser);  // Login route
router.post('/forgot-password', authController.forgotPassword);  // Forgot password route
router.post('/reset-password', authController.resetPassword);  // Reset password route

router.post('/logout', authController.logoutUser);
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
