const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');
const { validateRegistration } = require('../utils/validate');
require('dotenv').config();

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