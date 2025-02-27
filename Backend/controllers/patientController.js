const { getDb } = require('../config/db');
const { validatePatient } = require('../utils/validate');
const { ObjectId } = require('mongodb');


exports.createPatient = async (req, res) => {
  try {
    const db = await getDb();
    const patientsCollection = db.collection('patients');
    console.log('Request body:', req.body);

    const {
      first_name,
      last_name,
      email,
      mobile_phone,
      address_line_1,
      dob,
      gender,
    } = req.body;

    const validationErrors = validatePatient({
      first_name,
      last_name,
      email,
      mobile_phone,
      address_line_1,
      dob,
      gender,
    });

    if (Object.keys(validationErrors).length !== 0) {
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Validation failed', details: validationErrors },
      });
    }

    const existingPatient = await patientsCollection.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Email already exists' },
      });
    }

    

    const newPatient = {
      first_name,
      last_name,
      email,
      mobile_phone,
      address_line_1,
      dob,
      gender,
      deleted: false,
    };

    const result = await patientsCollection.insertOne(newPatient);
    res.status(201).json({
      success: true,
      data: { ...newPatient, _id: result.insertedId },
      error: null,
    });
  } catch (error) {
    console.error('Error in createPatient:', error.stack);
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error: ' + error.message },
    });
  }
};

exports.getPatientsPag = async (req, res) => {
  try {
    const db = await getDb();
    const patientsCollection = db.collection('patients');

    const {
      page = 1,
      limit = 10,
      search = '',
    } = req.query;

    const query = { deleted: { $ne: true } }; // Active patients only

    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const projection = {
      first_name: 1,
      last_name: 1,
      dob:1,
      gender:1,
      email: 1,
      mobile_phone: 1,
      address_line_1: 1,
      _id: 1,
    };

    const [patients, total] = await Promise.all([
      patientsCollection
        .find(query, { projection })
        .sort({ _id: -1 }) // Newest first
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      patientsCollection.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        patients,
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

exports.getPatientById = async (req, res) => {
  try {
    const db = await getDb();
    const patientsCollection = db.collection('patients');

    const patient = await patientsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!patient) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Patient not found' },
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
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

exports.updatePatient = async (req, res) => {
  try {
    const db = await getDb();
    const patientsCollection = db.collection('patients');

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Invalid patient ID format' },
      });
    }

    const existingPatient = await patientsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Patient not found' },
      });
    }


    //validation
    const Data = { ...req.body }; 
    const validationErrors = validatePatient(Data);

    if (Object.keys(validationErrors).length !== 0) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Validation failed', details: validationErrors },
      });
    }

    //removing email coz we dont want to mess with it.
    const { email, ...updateFields } = req.body;

    const fieldsToUpdate = {};
    for (const [key, value] of Object.entries(updateFields)) {
      if (value !== undefined && value !== null && String(value) !== String(existingPatient[key])) {
        fieldsToUpdate[key] = value;
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(200).json({
        success: true,
        data: existingPatient,
        error: null,
        message: 'No changes detected',
      });
    }

    // console.log("fieldsToUpdate")
    // console.log(fieldsToUpdate)

    const updatedPatient = await patientsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: fieldsToUpdate }, // Only update changed fields
      { returnDocument: 'after' }
    );
    
    
    if (!updatedPatient) {
        return res.status(404).json({
          success: false,
          data: null,
          error: { message: 'Patient not updated' },
        });
      }

    res.status(200).json({
      success: true,
      data: updatedPatient,
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

exports.deletePatient = async (req, res) => {
  try {
    const db = await getDb();
    const patientsCollection = db.collection('patients');

    const result = await patientsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { deleted: true } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Patient not found' },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient soft deleted',
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

module.exports = {
  createPatient: exports.createPatient,
  getPatientsPag: exports.getPatientsPag,
  getPatientById: exports.getPatientById,
  updatePatient: exports.updatePatient,
  deletePatient: exports.deletePatient,
};