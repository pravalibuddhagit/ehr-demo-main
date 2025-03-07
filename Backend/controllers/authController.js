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

    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

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