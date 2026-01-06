const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product= require("../models/productModel")

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({ status: "Placed" })
    .populate("user", "name email")
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.json(orders);
};


exports.placeOrderFromCart = async (req, res) => {
  try {


    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) =>
        sum + item.product.productPrice * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount,
      status: "Placed"
    });

    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
  
    res.status(500).json({ message: "Order failed" });
  }
};


const Razorpay = require("razorpay");

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys missing");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};



exports.buyNowPayment = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `buy_now_${Date.now()}`
    });

    res.json({
      razorpayOrderId: order.id,
      amount: order.amount
    });

  } catch (error) {
   
    res.status(500).json({ message: error.message });
  }
};




exports.buyNowSuccess = async (req, res) => {
  try {
    const { productId, paymentId } = req.body;

    const product = await Product.findById(productId);

    const order = await Order.create({
      user: req.user.id,
      items: [{
        product: product._id,
        quantity: 1
      }],
      totalAmount: product.productPrice,
      paymentId,
      paymentStatus: "paid"
    });

    res.json({ message: "Order placed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Order save failed" });
  }
};

