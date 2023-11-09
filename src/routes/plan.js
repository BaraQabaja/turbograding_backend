// routes/plans.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const plansController = require('../controllers/planController');

const router = express.Router();

router.get('/get-all-plans', plansController.getPlans);  // Fetch all plans

router.post('/create-plan', plansController.createPlan);  // Create a new plan


router.delete('/delete-plan/:id', plansController.deletePlan);  // Delete a plan
/*

router.get('/:id', authenticateToken, plansController.getPlan);  // Fetch a specific plan
router.post('/', authenticateToken, plansController.createPlan);  // Create a new plan
router.put('/:id', authenticateToken, plansController.updatePlan);  // Update a plan
router.delete('/:id', authenticateToken, plansController.deletePlan);  // Delete a plan
*/
module.exports = router;
