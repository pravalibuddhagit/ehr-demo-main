const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Managers= require('../models/Registration');
require('dotenv').config();

exports.registerUser = async (req, res) => {
  try {
   
    const { first_name, last_name, email, password } = req.body;
   
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, data:null ,error: { message: 'All fields are required' } });
    }
    
    const existingUser = await Managers.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false,  data:null ,error: { message: 'Email already registered' } });
    }
    
    // Validate password length (max 8 characters)
    if (password.length > 8) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        error: { message: "Password must be at most 8 characters long." } 
      });
    }

    /* if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{1,8}$/.test(password)) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        error: { message: "Password must be 1-8 characters long and include at least one uppercase letter, one number, and one special character." } 
      });
    }*/
    
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new Managers({
      first_name,
      last_name,
      email,
      password: password,
    });
   
    await user.save();
    res.status(201).json({ success: true, data: { user_id: user._id, email: user.email }  ,error:null});
  } catch (error) {
    res.status(500).json({ success: false,  data:null ,error: { message: 'Server Error : '+error.message } });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ success: false, data:null ,error: { message: 'All fields are required' } });
    }

    const user = await Managers.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false,data:null , error: { message: 'User not Found ' } });
    }

   

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, data:null ,error: { message: 'Password Incorrect' } });
    }
    
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, data: { token },error:null});
  } catch (error) {
    res.status(500).json({ success: false,data:null , error: { message: 'Server Error : '+ error.message } });
  }
};


/*exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const userId = req.user.userId; // Extracted from JWT token

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, data:null,error: { message: 'User not found' } });
    }

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, data:null ,error: { message: 'All fields are required' } });
    }
    
    if (first_name) {
      if (!/^[A-Za-z][A-Za-z\s]{0,34}$/.test(first_name)) {
        return res.status(400).json({ success: false, error: { message: 'Invalid first name' } });
      }
      user.first_name = first_name;
    }

    if (last_name) {
      if (!/^[A-Za-z][A-Za-z\s]{0,34}$/.test(last_name)) {
        return res.status(400).json({ success: false, error: { message: 'Invalid last name' } });
      }
      user.last_name = last_name;
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ success: false, error: { message: 'Email already in use' } });
      }
      user.email = email;
    }

    if (password) {
      if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}/.test(password)) {
        return res.status(400).json({ success: false, error: { message: 'Password must have at least one uppercase, one number, one special character, and be 8 characters long' } });
      }
    
    }

    await user.save();

    res.status(200).json({ success: true, data: { message: 'Profile updated successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
}*/

