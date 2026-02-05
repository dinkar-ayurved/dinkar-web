const express = require("express");
const { placeOrder } = require("../controllers/order.controller");
const {protect} = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, placeOrder);

module.exports = router;
