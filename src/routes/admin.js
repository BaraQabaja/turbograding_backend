// Route /api/admin

const express = require("express");
const adminAuthController = require("../controllers/adminAuthController");
const adminPlansController = require("../controllers/adminPlanController");
const profileController = require("../controllers/profileController");
const adminProfileController = require("../controllers/adminProfileController");
const adminDashboardController = require("../controllers/adminDashboardController");
const auth = require("../controllers/authController");

const router = express.Router();

router.post("/admin-register", adminAuthController.adminRegister); // Registration route

// Plan routes
router.get("/get-all-plans", adminPlansController.getPlans); // Fetch all plans

router.post("/create-plan", adminPlansController.createPlan); // Create a new plan

router.delete("/delete-plan", adminPlansController.deletePlan); // Delete a plan

router.put("/update-plan", adminPlansController.updatePlan); // update a plan

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
router.get("/get-all-Users", adminDashboardController.getUsers); // Fetch all Users
module.exports = router;
