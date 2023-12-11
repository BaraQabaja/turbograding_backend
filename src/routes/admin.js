// Route /api/admin

const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();
 


router.post('/admin-register', adminController.adminRegister);  // Registration route

module.exports=router