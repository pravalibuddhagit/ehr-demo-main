const { getDb } = require('../config/db');
const { validateUser } = require('../utils/validate');
const { ObjectId } = require('mongodb');

exports.createUser = async (req, res) => {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    console.log('Request body:', req.body); // incoming data
    const {
      first_name,
      last_name,
      email,
      mobile_phone,
      address_line_1,
      address_line_2,
      city,
      state,
      zipcode,
      country,
      dob,
      notes,
      gender,
      agreeToTerms,
      allowNotifications,
    } = req.body;

    // Validate using reusable function
    const validationErrors = validateUser({
      first_name,
      last_name,
      email,
      mobile_phone,
      address_line_1,
      address_line_2,
      city,
      state,
      zipcode,
      country,
      dob,
      gender,
      agreeToTerms,
      allowNotifications,
    });
  
    if (Object.keys(validationErrors).length !== 0) {
      console.log('Validation errors:', validationErrors); // validation errors

      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Validation failed', details: validationErrors },
      });
    }

  
   // Parse dob from yyyy-mm-dd to Date object, with safety check

  //    const [year, month, day] = dob.split('-').map(Number);
  //    dobDate = new Date(year, month - 1, day); // month is 0-based
  //  console.log(dobDate);

    // Check for existing email
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('Existing user found:', existingUser); // if email exists
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Email already exists' },
      });
    }

    const newUser = {
      first_name,
      last_name,
      email,
      mobile_phone,
      address_line_1,
      address_line_2: address_line_2 || '',
      city,
      state,
      zipcode,
      country: country || 'US',
      dob,
      notes: notes || '',
      gender,
      agreeToTerms,
      allowNotifications: allowNotifications || false,
      // status: 0,
      status: 0
    
    };

    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({
      success: true,
      data: { ...newUser, _id: result.insertedId },
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

// Optionally validate updates in updateUser
exports.updateUser = async (req, res) => {
  try {

    // Check if ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Invalid user ID format' },
      });
    }

    console.log("In updateUser, ID from params:", req.params.id); // Log the ID

    const db = await getDb();
    const usersCollection = db.collection('users');
   
    // Fetch the existing user
    const existingUser = await usersCollection.findOne({ _id: new ObjectId(req.params.id), status: 0  });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'User not found' },
      });
    }


    const Data = { ...req.body }; 

    const validationErrors = validateUser(Data);

    if (Object.keys(validationErrors).length !== 0) {
      console.log('Validation errors:', validationErrors); // validation errors

      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Validation failed', details: validationErrors },
      });
    }


    // Fetch the existing user
   //console.log(existingUser);
   
 
   
    // Remove email from req.body to avoid accidental updates
    const { email, ...updateFields } = req.body;
    
    // Filter out fields that haven’t changed
    const fieldsToUpdate = {};
    for (const [key, value] of Object.entries(updateFields)) {
      // Handle special case for dob (needs parsing)
    if (value !== undefined && value !== null && String(value) !== String(existingUser[key])) {
        fieldsToUpdate[key] = value;
      }
    }

    console.log("Fields to update:", fieldsToUpdate); // Log what will be updated

    // If no fields to update, return the existing user
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(200).json({
        success: true,
        data: existingUser,
        error: null,
        message: 'No changes detected'
      });
    }

 // Perform the update
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: fieldsToUpdate }, // Only update changed fields
      { returnDocument: 'after' }
    );


  //  console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'User not updated' },
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error:' + error.message },
    });
  }
};

// methods (getAllUsers, getUsers, getUsersPag, getUserById, deleteUser)
exports.getAllUsers = async (req, res) => {
  try {
    const db =await getDb();
    const usersCollection = db.collection('users');

    const users = await usersCollection.find({}).toArray();
    res.status(200).json({
      success: true,
      data: users,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error at getAllUsers: ' + error.message },
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');

    const users = await usersCollection.find({ status:0}).toArray();
    res.status(200).json({
      success: true,
      data: users,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error at getUsers: ' + error.message },
    });
  }
};

// exports.getUsersPag = async (req, res) => {
//   try {
//     const db = await getDb();
//     const usersCollection = db.collection('users');

//     const {
//       page = 1,
//       limit = 10,
//       search = '',
//       state = '',
//       stateMode = 'contains',
//       country = '',
//       countryMode = 'contains',
//     } = req.query;

//     console.log('Query Parameters:users', req.query);
//     const query = { 
//     status:0
//      }; // Active users only

//     if (search) {
//       query.$or = [
//         { first_name: { $regex: search, $options: 'i' } },
//         { last_name: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const buildFilter = (value, mode) => {
//       switch (mode.toLowerCase()) {
//         case 'startswith':
//           return { $regex: `^${value}`, $options: 'i' }; // Correct string interpolation
//         case 'contains':
//           return { $regex: value, $options: 'i' };
//         case 'notcontains':
//           return { $not: { $regex: value, $options: 'i' } };
//         case 'endswith':
//           return { $regex: `${value}$`, $options: 'i' }; // Correct string interpolation
//         case 'equals':
//           return value;
//         case 'notequals':
//           return { $ne: value };
//         default:
//           return { $regex: value, $options: 'i' };
//       }
//     };
    
//     if (state) query.state = buildFilter(state, stateMode);
//     if (country) query.country = buildFilter(country, countryMode);

//     //console.log(query)

//     const pageNum = parseInt(page, 10) || 1;
//     const limitNum = parseInt(limit, 10) || 10;
//     const skip = (pageNum - 1) * limitNum;

//     const projection = {
//       first_name: 1,
//       last_name: 1,
//       dob: 1,
//       gender: 1,
//       email: 1,
//       state: 1,
//       country: 1,
//       _id: 1, 
//     };

//     const [users, total] = await Promise.all([
//       usersCollection
//       .find(query,{projection})
//       .sort({ _id: -1 }) // newest first
//       .skip(skip)
//       .limit(limitNum)
//       .toArray(),
//       usersCollection.countDocuments(query),
//     ]);

// // console.log(users)
//     res.json({
//       success: true,
//       data: {
//         users,
//         pagination: {
//           currentPage: pageNum,
//           totalPages: Math.ceil(total / limitNum),
//           totalRecords: total,
//           recordsPerPage: limitNum,
//         },
//       },
//       error: null,
//     });
  

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       data: null,
//       error: { message: 'Server Error: ' + error.message },
//     });
//   }
// };

exports.getUsersPag = async (req, res) => {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
 
    const {
      page = 1,
      limit = 10,
      search = '',
      state = '',
      stateMode = 'contains',
      country = '',
      countryMode = 'contains',
    } = req.query;
 
    console.log('Query Parameters: users', req.query);
 
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
 
    // Function to build filter conditions
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
          return value;
        case 'notequals':
          return { $ne: value };
        default:
          return { $regex: value, $options: 'i' };
      }
    };
 
    // Build filters
    const filters = [{ status: 0 }]; // Active users only
 
    if (state) filters.push({ state: buildFilter(state, stateMode) });
    if (country) filters.push({ country: buildFilter(country, countryMode) });
 
    // Atlas Search Pipeline
    const pipeline = [];
 
    if (search.trim() !== '') {
      pipeline.push({
        $search: {
          index: "user", // Ensure this matches your Atlas Search index name
          compound: {
            should: [
              {
                autocomplete: {
                  query: search,
                  path: "first_name",
                  tokenOrder: "sequential",
                  fuzzy: { maxEdits: 1 }
                }
              },
              {
                autocomplete: {
                  query: search,
                  path: "last_name",
                  tokenOrder: "sequential",
                  fuzzy: { maxEdits: 1 }
                }
              }
            ],
            minimumShouldMatch: 1
          }
        }
      });
    }
 
    // Apply additional filters after Atlas Search
    if (filters.length > 0) {
      pipeline.push({ $match: { $and: filters } });
    }
 
    // Sorting, Pagination, and Projection
    pipeline.push(
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limitNum },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          dob: 1,
          gender: 1,
          email: 1,
          state: 1,
          country: 1,
          _id: 1,
        }
      }
    );
 
    // Execute Aggregation Pipeline
    const users = await usersCollection.aggregate(pipeline).toArray();
    const total = await usersCollection.countDocuments({ status: 0 });
 
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalRecords: total,
          recordsPerPage: limitNum,
        },
      },
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

exports.getUserById = async (req, res) => {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
  
    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id), status: 0 });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'User not found' },
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error at getUserById: ' + error.message },
    });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
  

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id), status: 0  },
      { $set: { status:1} },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'User not found' },
      });
    }

    res.status(200).json({
      success: true,
      message: 'User soft deleted',
      error: null
      
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error: ' + error.message },
    });
  }
};