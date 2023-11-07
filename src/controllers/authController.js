const config = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

exports.logoutUser = async (req, res) => {
    // const refreshToken = req.body.token;

    // if (!refreshToken) return res.status(400).json({ error: "No refresh token provided" });

    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];

        
        // await TokenBlacklist.create({ token: token }); // store blacklisted token to the database
        //  jwt.verify(accessToken, config.auth.accessToken,  (err, user) => {
        //if (err) return res.sendStatus(403);

        //   const result = await RefreshToken.destroy({ where: { token: refreshToken } });

        //   if (result === 0) {
        //        return res.status(404).json({ error: "Refresh token not found" });
        //   }
       
        res.status(200).json({ message: "Successfully logged out" });
        //  });
    } catch (error) {
        res.status(500).json({ error: "Failed to log out" });
    }
};

exports.registerUser = async (req, res) => {
    // Registration logic goes here
    const email = req.body.email;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create a new user
        const user = await User.create({ ...req.body });
        // Respond with the created user
        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};




exports.loginUser = async (req, res) => {
    // Login logic goes here
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.validPassword(password)) {
        console.log({ message: 'Invalid email or password' });
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // User is authenticated, issue a token
    const token = jwt.sign({ userId: user.id, firstName: user.firstName, lastName: user.lastName }, config.auth.accessToken, { expiresIn: '7d'/*'15m'*/ });

    const refreshTokenValue = jwt.sign({ userId: user.id, firstName: user.firstName, lastName: user.lastName }, config.auth.refreshToken, { expiresIn: '7d' });

    /* const refreshToken = await RefreshToken.create({
         token: refreshTokenValue,
         userId: user.id // assuming user is your Sequelize user instance
     });*/

    console.log({ token });
    // Send the token to the client
    return res.json({ token });
};


exports.forgotPassword = (req, res) => {
    // Here you should implement your process for password recovery.
    // Typically, this involves sending an email to the user with a unique link
    // they can use to reset their password.
    res.status(501).json({ error: 'Not implemented' });
};

exports.resetPassword = (req, res) => {
    // Here you should implement your process for resetting a user's password.
    // This usually involves checking a token sent in the reset password request
    // against one stored in the database or the reset password link,
    // then updating the user's password in the database if the tokens match.
    res.status(501).json({ error: 'Not implemented' });
};
