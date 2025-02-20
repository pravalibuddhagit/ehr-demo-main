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
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error at getAllUsers' } });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Fetch users with 'deleted' set to false
    const users = await User.find({ deleted: false });
    res.status(200).json({ success: true, data: users , error:null});
  } catch (error) {
    res.status(500).json({ success: false, data:null,error: { message: 'Server Error at getUsers' } });
  }
};

exports.getUsersPag = async (req, res) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      search = '',
      state = '',
      stateMode = 'contains', // Default match mode
      country = '',
      countryMode = 'contains' // Default match mode
    } = req.query;

    console.log('Query Parameters:', req.query);

    // Build query object
  
    const query = {
      deleted: { $ne: true } // Exclude soft-deleted users
    };

    // Search by first_name or last_name
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } }
      ];
    }

    // Function to build filter based on match mode
    const buildFilter = (value, mode) => {
      switch (mode.toLowerCase()) {
        case 'startswith':
          return { $regex: `^${value}`, $options: 'i' };
        case 'contains':
          return { $regex: value, $options: 'i' };
        case 'notcontains':
          return { $not: { $regex: value, $options: 'i' } };
        case 'endswith':
          return { $regex: `${value}$`, $options: 'i' };
        case 'equals':
          return { $eq: value };
        case 'notequals':
          return { $ne: value };
        default:
          return { $regex: value, $options: 'i' }; // Fallback to contains
      }
    };

    // Filter by state with match mode
    if (state) {
      query.state = buildFilter(state, stateMode);
    }

    // Filter by country with match mode
    if (country) {
      query.country = buildFilter(country, countryMode);
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10) || 1; // Ensure valid integer, default to 1
    const limitNum = parseInt(limit, 10) || 10; // Ensure valid integer, default to 10
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [users, total] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
    ]);

    // Prepare response
    const response = {
      users,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalRecords: total,
        recordsPerPage: limitNum
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false,data:null, error: { message: 'User not found' } });

    res.status(200).json({ success: true, data: user,error:null });
  } catch (error) {
    res.status(500).json({ success: false, data:null, error: { message: 'Server Error at getUserbyId' } });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true,runValidators: true });
    if (!updatedUser) return res.status(404).json({ success: false, data:null,error: { message: 'User not found' } });

    res.status(200).json({ success: true, data: updatedUser ,error:null});
  } catch (error) {
    res.status(500).json({ success: false, data:null,error: { message: 'Invalid fields' } });
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
