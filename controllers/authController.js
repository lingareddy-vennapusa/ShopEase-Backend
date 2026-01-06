
const User = require("../models/usersModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    
    await sendEmail(
      user.email,
      "Welcome to ShopEase 🎉",
      `Hi ${user.name},

Welcome to ShopEase!

Your account has been successfully created.
You can now login and start shopping.

Happy Shopping 🙂
– Team ShopEase`
    );

    res.status(201).json({
      message: "Registration successful. Email sent."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    
  
   const user = await User.findOne({
  email: email.toLowerCase().trim()
});

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};






exports.forgotPassword = async (req, res) => {
  try {
 

    let { email } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const resetToken = crypto.randomBytes(20).toString("hex");

    
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

 
    return res.status(200).json({
      message: "Password reset link sent",
      resetUrl
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Forgot password failed" });
  }
};




exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Reset password failed" });
  }
};
