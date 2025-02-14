const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Managers= require('../models/Registration');



// Get Manager by ID
exports.getManagerById = async (req, res) => {
  try {
    const manager = await Managers.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ success: false, data: null, error: { message: 'Manager not found' } });
    }
    res.status(200).json({ success: true, data: manager ,error:null});
  } catch (error) {
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error : '+ error.message } });
  }
};

// Update Manager
exports.updateManager= async (req, res) => {
  try {
    const updatedManager = await Managers.findByIdAndUpdate(req.params.id, req.body, { new: true,runValidators: true });
    if (!updatedManager) {
      return res.status(404).json({ success: false, data: null, error: { message: 'Manager not found' } });
    }

    res.status(200).json({ success: true, data: updatedManager ,error:null});
    console.log("Manager updated succesfully")
  } catch (error) {
    res.status(500).json({ success: false,data:null, error: { message:  'Server Error : '+error.message } });
  }
};


// Delete Manager
exports.deleteManager = async (req, res) => {
  try {
    const deletedManager = await Managers.findByIdAndDelete(req.params.id);
    if (!deletedManager) {
      return res.status(404).json({ success: false, data: null, error: { message: 'Manager not found' } });
    }

    res.status(200).json({ success: true, data: deletedManager,error:null });
    consolr.log("Manager deleted Successfully")

  } catch (error) {
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error : ' +error.message } });
  }
};

//get all managers
exports.getAllManagers = async( req, res)=>{
 try{
 const allManagers= await Managers.find();
   return res.status(200).json({success: true, data: allManagers, error:null });

 }catch(error){
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error' } });

 }
}