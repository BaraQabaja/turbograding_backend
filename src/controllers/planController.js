const Plan = require('../models/Plan');

module.exports = {
  async createPlan(req, res) {
    const { name, description, price, duration } = req.body;
    try {
      const plan = await Plan.create({ name, description, price, duration });
      return res.status(201).json(plan);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getPlans(req, res) {
    try {
      const plans = await Plan.findAll();
      return res.status(200).json(plans);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Add other controller methods as needed
};
