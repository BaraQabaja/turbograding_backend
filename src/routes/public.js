const planController = require("../controllers/planController");
const express = require("express");

const router = express.Router();

router.get("/get-all-plans", planController.getPlans); // get all plans

module.exports = router;
