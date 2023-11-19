const schedule = require("node-schedule");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

const httpStatusText = require("./httpStatusText");
const config = require("../config");
const { Op } = require('sequelize'); // Include Sequelize Op operator

// Schedule a job to run every day at midnight
const job = schedule.scheduleJob("0 0 1 * *", async () => {
  try {

    // find the basic plan to use its dataa
    const plan=await Plan.findOne({where:{
      name:'basic'
     }})
    // Find subscriptions where endDate has passed and status is still 'active'
    const basicSubscriptions = await Subscription.findAll({
        where: {
          planId: plan.id, // the plan id of basic plan
          
        },
      });
     
      await 
      // Update the remainingQuestions and remainingExams and remainingAssignments
      await Promise.all(
        basicSubscriptions.map(async (subscription) => {
          subscription.remainingQuestions = plan.questions;
          subscription.remainingExams = plan.exams;
          subscription.remainingAssignments = plan.assignments;

          await subscription.save();
        })
      );
  
    console.log("basic Subscriptions updated successfully.");
  } catch (error) {
    console.error("Error updating basic subscription:", error.message);
  }
});

