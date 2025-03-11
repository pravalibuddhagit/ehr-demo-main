const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');
const { validateRegistration } = require('../utils/validate');
require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Change if using another provider
  auth: {
    user: process.env.EMAIL_USER, // Add this in .env
    pass: process.env.EMAIL_PASS  // Add this in .env
  }
});


exports.sendOTP = async (req, res) => {
  try {
    const db = await getDb();
    const usersCollection = db.collection("registrations");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    // Store OTP in DB
    await usersCollection.updateOne(
      { email },
      { $set: { otp, otpExpires } }
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 500px; margin: auto; background: #f9f9f9; color: #333; padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); border: 1px solid #ddd;">
    
    <!-- Header -->
    <h2 style="margin-bottom: 15px; font-size: 24px; font-weight: bold; color: #007bff;">Secure OTP Verification</h2>
    <p style="font-size: 15px; color: #555;">Hello <strong>${user.first_name} ${user.last_name}</strong>,</p>
    
    <p style="font-size: 15px; color: #555;">Use the code below to complete your authentication:</p>

    <!-- OTP Box -->
    <div style="margin: 20px auto; background: #e0e0e0; padding: 15px; display: inline-block; font-size: 28px; font-weight: bold; color: #007bff; letter-spacing: 3px; border-radius: 8px;">
        ${otp}
    </div>

    <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
    
    <p style="font-size: 14px; color: #777;">If you didn't request this, please ignore this email.</p>

    <hr style="border: 1px solid #ddd; margin: 20px 0;" />

    <p style="font-size: 12px; color: #777;">Need help? Contact our support team.</p>
    <p style="font-size: 12px; color: #777;">&copy; 2025 Edvak EHR. All rights reserved.</p>
</div>


    `
    });

    res.status(200).json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const db = await getDb();
    const usersCollection = db.collection("registrations");

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and OTP are required" });
    }

    const user = await usersCollection.findOne({ email });

    if (!user || user.otp !== parseInt(otp) || Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
    }

    // OTP is valid - clear it and log in user
    await usersCollection.updateOne(
      { email },
      { $unset: { otp: "", otpExpires: "" } }
    );

    

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); //, { expiresIn: '1h' }

    res.status(200).json({
      success: true,
      data: { token },
      error: null,
    });
    console.log(token)

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }


  
};



exports.resetPassword = async (req, res) => {
  try {
    const db = await getDb();
    const managersCollection = db.collection('registrations');

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: { message: "Token and new password are required" } });
    }

    // Find user with the reset token
    const user = await managersCollection.findOne({ resetToken: token });

    if (!user || user.resetTokenExpires < Date.now()) {
      return res.status(400).json({ success: false, error: { message: "Invalid or expired token" } });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    await managersCollection.updateOne(
      { resetToken: token },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpires: "" } // Remove the reset token
      }
    );

    res.status(200).json({ success: true, data: { message: "Password has been reset successfully" } });

  } catch (error) {
    res.status(500).json({ success: false, error: { message: "Server Error: " + error.message } });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const db = await getDb();
    const managersCollection = db.collection('registrations');

    const { email, frontendUrl } = req.body; // Get frontend URL from request

    if (!email) {
      return res.status(400).json({ success: false, error: { message: "Email is required" } });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));


    const user = await managersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: { message: "User not found" } });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hour expiry

    // Store token in database
    await managersCollection.updateOne(
      { email },
      { $set: { resetToken, resetTokenExpires } }
    );

    // Create reset link (frontend should handle reset page)
    // const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&firstName=${encodeURIComponent(user.first_name)}&email=${encodeURIComponent(user.email)}`;


    // const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Send Email
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Password Reset Request",
    //   text: `Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.`
    // };



    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
       <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
  
  <p style="color: #333;">Dear <strong style="color: #000;"> ${user.first_name || "User"} ${user.last_name}</strong>,</p>
  
  <p style="color: #333;">You have requested to reset your password. Click the button below to reset your password:</p>
  
  <p style="text-align: center;">
    <a href="${resetLink}" 
       style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff !important; 
              text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
      Reset Password
    </a>
  </p>
  
  <p style="color: #333;">If you did not request a password reset, please ignore this email.</p>
  
  <p style="color: #333;">Note: This link is valid for <strong style="color: #000;">1 hour</strong>.</p>
  
  <hr style="border: 1px solid #ddd;" />
  
  <p style="font-size: 12px; text-align: center; color: #777;">&copy; 2025 Edvak EHR Company. All rights reserved.</p>
</div>

      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, data: { message: "Password reset link sent to email." } });

  } catch (error) {
    res.status(500).json({ success: false, error: { message: "Server Error: " + error.message } });
  }
};




exports.registerUser = async (req, res) => {
  try {
    const db = await getDb();
    const managersCollection = db.collection('registrations');

    const { first_name, last_name, email, password } = req.body;

    // Validate using reusable function
    const validationErrors = validateRegistration({ first_name, last_name, email, password });
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Validation failed', details: validationErrors },
      });
    }

    // Check for existing user
    const existingUser = await managersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Email already registered' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const result = await managersCollection.insertOne(user);
    res.status(201).json({
      success: true,
      data: { user_id: result.insertedId, email: user.email },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error: ' + error.message },
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const db = await getDb();
    const managersCollection = db.collection('registrations');

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'All fields are required' },
      });
    }

    const user = await managersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Check Your Email again' },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Password incorrect' },
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); //, { expiresIn: '1h' }

    res.status(200).json({
      success: true,
      data: { token },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error: ' + error.message },
    });
  }
};