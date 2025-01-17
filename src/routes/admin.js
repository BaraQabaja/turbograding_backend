// Route /api/admin

const express = require("express");
const adminAuthController = require("../controllers/adminAuthController");
const adminPlanController = require("../controllers/adminPlanController");
const profileController = require("../controllers/profileController");
const adminProfileController = require("../controllers/adminProfileController");
const adminDashboardController = require("../controllers/adminDashboardController");
const adminSubscriptionController=require("../controllers/adminSubscriptionController");
const auth = require("../controllers/authController");

const router = express.Router();

router.post("/admin-register", adminAuthController.adminRegister); // Registration route

// Plan routes
router.get("/get-all-plans", auth.protect, adminPlanController.getPlans); // Fetch all plans

router.post("/create-plan", auth.protect, adminPlanController.createPlan); // Create a new plan

router.delete("/delete-plan", auth.protect, adminPlanController.deletePlan); // Delete a plan

router.put("/update-plan", auth.protect, adminPlanController.updatePlan); // update a plan

// profile routes
router.put("/update-password", auth.protect, profileController.updatePassword); // update user(admin) password

router.put("/update-username", auth.protect, profileController.updateUsername); // update user(admin) name

router.put("/update-bio", auth.protect, profileController.updateBio); // update user bio

router.get(
  "/get-personal-info",
  auth.protect,
  adminProfileController.getPersonalInformation
); // get user(admin) profile info

// admin dashboard routes
router.get("/get-all-Users", auth.protect, adminDashboardController.getUsers); // Fetch all Users


// admin Subscription routes
router.get("/get-all-Subscriptions", auth.protect, adminSubscriptionController.getAllSubscriptions); // Fetch all Subscriptions
module.exports = router;
