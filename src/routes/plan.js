// routes/plans.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const plansController = require('../controllers/planController');

const router = express.Router();
/*
router.get('/', authenticateToken, plansController.getAllPlans);  // Fetch all plans
router.get('/:id', authenticateToken, plansController.getPlan);  // Fetch a specific plan
router.post('/', authenticateToken, plansController.createPlan);  // Create a new plan
router.put('/:id', authenticateToken, plansController.updatePlan);  // Update a plan
router.delete('/:id', authenticateToken, plansController.deletePlan);  // Delete a plan
*/
module.exports = router;
