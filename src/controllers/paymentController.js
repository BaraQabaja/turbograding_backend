const Payment = require('../models/Payment');

module.exports = {
  async createPayment(req, res) {
    const { subscriptionId, amount, paymentDate } = req.body;
    try {
      const payment = await Payment.create({ subscriptionId, amount, paymentDate });
      return res.status(201).json(payment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getPayments(req, res) {
    try {
      const payments = await Payment.findAll();
      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Add other controller methods as needed
};
