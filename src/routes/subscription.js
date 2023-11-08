// routes/subscriptions.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const subscriptionsController = require('../controllers/subscriptionController');

const router = express.Router();
/*
router.get('/', authenticateToken, subscriptionsController.getAllSubscriptions);  // Fetch all subscriptions
router.get('/:id', authenticateToken, subscriptionsController.getSubscription);  // Fetch a specific subscription
router.post('/', authenticateToken, subscriptionsController.createSubscription);  // Create a new subscription
router.put('/:id', authenticateToken, subscriptionsController.updateSubscription);  // Update a subscription
router.delete('/:id', authenticateToken, subscriptionsController.deleteSubscription);  // Delete a subscription
*/
module.exports = router;
