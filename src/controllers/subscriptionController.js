const Subscription = require('../models/Subscription');

module.exports = {
  async createSubscription(req, res) {
    const { userId, planId, startDate, endDate } = req.body;
    try {
      const subscription = await Subscription.create({ userId, planId, startDate, endDate });
      return res.status(201).json(subscription);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getSubscriptions(req, res) {
    try {
      const subscriptions = await Subscription.findAll();
      return res.status(200).json(subscriptions);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Add other controller methods as needed
};
