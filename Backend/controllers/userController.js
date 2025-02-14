const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
    });    
    const existingUser = await User.findOne({email:newUser.email});  
    if (existingUser) {
      
        return res.status(400).json({ success: false,  data:null ,error: { message: 'Email already exists' } });
    }        
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
    console.log("succesfully creeated the user")
  } catch (error) {
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error : '+ error.message } });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users,error:null });
  } catch (error) {
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error' } });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Fetch users with 'deleted' set to false
    const users = await User.find({ deleted: false });
    res.status(200).json({ success: true, data: users , error:null});
  } catch (error) {
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error' } });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false,data:null, error: { message: 'User not found' } });

    res.status(200).json({ success: true, data: user,error:null });
  } catch (error) {
    res.status(500).json({ success: false, data:null, error: { message: 'Server Error' } });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true,runValidators: true });
    if (!updatedUser) return res.status(404).json({ success: false, data:null,error: { message: 'User not found' } });

    res.status(200).json({ success: true, data: updatedUser ,error:null});
  } catch (error) {
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error' } });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!user) return res.status(404).json({ success: false,data:null, error: { message: 'User not found' } });

    res.status(200).json({ success: true, message: 'User soft deleted' ,error:null});
  } catch (error) {
    res.status(500).json({ success: false, data:null, error: { message: 'Server Error' } });
  }
};
