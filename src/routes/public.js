const planController = require("../controllers/planController");
const express = require("express");

const router = express.Router();

router.put("/get-all-plans", planController.getPlans); // get all plans

module.exports = router;
