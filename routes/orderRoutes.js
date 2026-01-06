const express = require("express");
const {
  getUserOrders,
  getAllOrders,
    placeOrderFromCart,buyNowPayment,buyNowSuccess
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const router = express.Router();


router.post("/checkout", protect, placeOrderFromCart);

router.post("/buy-now/payment", protect, buyNowPayment);
router.post("/buy-now/success", protect, buyNowSuccess);


router.get("/my-orders", protect, getUserOrders);


router.get("/", protect, isAdmin, getAllOrders);

module.exports = router;
