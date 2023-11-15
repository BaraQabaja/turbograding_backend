const schedule = require("node-schedule");
const Subscription = require("../models/Subscription");
const httpStatusText = require("./httpStatusText");
const config = require("../config");
const { Op } = require('sequelize'); // Include Sequelize Op operator

// Schedule a job to run every day at midnight
const job = schedule.scheduleJob("0 0 * * *", async () => {
  try {
    // Find subscriptions where endDate has passed and status is still 'active'
    const expiredSubscriptions = await Subscription.findAll({
        where: {
          endDate: { [Op.lt]: new Date() }, // Op.lt means less than
          status: 'active',
        },
      });
  
      // Update the status to 'inactive' for expired subscriptions
      await Promise.all(
        expiredSubscriptions.map(async (subscription) => {
          subscription.status = 'inactive';
          await subscription.save();
        })
      );
  
    console.log("Subscription statuses updated successfully.");
  } catch (error) {
    console.error("Error updating subscription statuses:", error.message);
  }
});

