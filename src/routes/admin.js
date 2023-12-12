// Route /api/admin

const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const adminPlansController = require('../controllers/adminPlanController');
const router = express.Router();
 


router.post('/admin-register', adminAuthController.adminRegister);  // Registration route


// Plan routes
router.get('/get-all-plans', adminPlansController.getPlans);  // Fetch all plans 

router.post('/create-plan', adminPlansController.createPlan);  // Create a new plan


router.delete('/delete-plan', adminPlansController.deletePlan);  // Delete a plan

router.put('/update-plan', adminPlansController.updatePlan);  // update a plan


// User routes
// router.get('/get-all-users', adminPlansController.getPlans);  // Fetch all users (id,name,email,role,plan name)

// router.delete('/delete-user', adminPlansController.deletePlan);  // Delete a plan



module.exports=router