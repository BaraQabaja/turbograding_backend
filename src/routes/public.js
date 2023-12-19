//route api/public
const planController = require("../controllers/planController");
const messageController = require("../controllers/messageController");

const express = require("express");

const router = express.Router();

router.get("/get-all-plans", planController.getPlans); // get all plans
router.post("/send-message", messageController.sendMessage); // send message

module.exports = router;
