const { getDb } = require('../config/db');
const { validateAppointment } = require('../utils/validate');
const { ObjectId } = require('mongodb');

exports.createAppointment = async (req, res) => {
  try {
    const db = await getDb();
    const appointmentCollection = db.collection('appointments');
    const userCollection = db.collection('users');
    const patientCollection = db.collection('patients');

    console.log('Request body:', req.body);
    const {
      provider_id, // Expecting ObjectId from frontend
      patient_id,  // Expecting ObjectId from frontend
      reason,
      appointment_date,
      appointment_time,
      status = 'pending', // Default to pending
    } = req.body;

    const validationErrors = validateAppointment({
      provider_id,
      patient_id,
      reason,
      appointment_date,
      appointment_time,
      status,
    });

    if (Object.keys(validationErrors).length !== 0) {
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Validation failed', details: validationErrors },
      });
    }

    // Verify provider exists
    const provider = await userCollection.findOne({ _id: new ObjectId(provider_id) });
    if (!provider) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Provider not found' },
      });
    }

    // Verify patient exists
    const patient = await patientCollection.findOne({ _id: new ObjectId(patient_id) });
    if (!patient) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Patient not found' },
      });
    }

   

    const newAppointment = {
      provider_id: new ObjectId(provider_id),
      patient_id: new ObjectId(patient_id),
      reason,
      appointment_date,
      appointment_time,
      status,
      deleted: false,
    };

    const result = await appointmentCollection.insertOne(newAppointment);
    res.status(201).json({
      success: true,
      data: { ...newAppointment, _id: result.insertedId },
      error: null,
    });
  } catch (error) {
    console.error('Error in createAppointment:', error.stack);
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error: ' + error.message },
    });
  }
};

// exports.getAppointmentsPag = async (req, res) => {
//   try {
//     const db = await getDb();
//     const appointmentCollection = db.collection('appointments');
//     const userCollection = db.collection('users');
//     const patientCollection = db.collection('patients');

//     const {
//       page = 1,
//       limit = 10,
//       search = '',
//     } = req.query;

//     console.log('Query Parameters:appointments', req.query);
//     const query = { deleted: { $ne: true } };

//     if (search) {
//       // Search will require joining with users and patients, so we'll handle it differently
//       // For simplicity, assume search is on reason for now
//       //query.reason = { $regex: search, $options: 'i' };
//       const searchRegex = { $regex: search, $options: 'i' };

//       // Find matching providers
//       const matchingProviders = await userCollection
//         .find(
//           {
//             $or: [
//               { first_name: searchRegex },
//               { last_name: searchRegex },
//             ],
//           },
//           { projection: { _id: 1 } }
//         )
//         .toArray();
//       const providerIds = matchingProviders.map((p) => p._id);

//       // Find matching patients
//       const matchingPatients = await patientCollection
//         .find(
//           {
//             $or: [
//               { first_name: searchRegex },
//               { last_name: searchRegex },
//             ],
//           },
//           { projection: { _id: 1 } }
//         )
//         .toArray();
//       const patientIds = matchingPatients.map((p) => p._id);
//       // Update query to include appointments where provider_id or patient_id matches
//       if (providerIds.length > 0 || patientIds.length > 0) {
//         query.$or = [];
//         if (providerIds.length > 0) {
//           query.$or.push({ provider_id: { $in: providerIds } });
//         }
//         if (patientIds.length > 0) {
//           query.$or.push({ patient_id: { $in: patientIds } });
//         }
//       } else {
//         // If no matches found in providers or patients, return empty result
//         query._id = null; // This ensures no results are returned
//       }
    
//     }

//     const pageNum = parseInt(page, 10) || 1;
//     const limitNum = parseInt(limit, 10) || 10;
//     const skip = (pageNum - 1) * limitNum;

//     const appointments = await appointmentCollection
//     //appointment_date: -1, 
//       .find(query)
//       .sort({ _id: -1 }) // Sort by date descending, then ID
//       .skip(skip)
//       .limit(limitNum)
//       .toArray();

//     // Populate provider and patient details
//     const populatedAppointments = await Promise.all(
//       appointments.map(async (appt) => {
//         const provider = await userCollection.findOne({ _id: appt.provider_id }, { projection: { first_name: 1, last_name: 1, email: 1 } });
//         const patient = await patientCollection.findOne({ _id: appt.patient_id }, { projection: { first_name: 1, last_name: 1, email: 1 } });
//         return {
//           ...appt,
//           provider: provider ? { first_name: provider.first_name, last_name: provider.last_name, email: provider.email } : null,
//           patient: patient ? { first_name: patient.first_name, last_name: patient.last_name, email: patient.email } : null,
//         };
//       })
//     );
    

//     const total = await appointmentCollection.countDocuments(query);

//     res.json({
//       success: true,
//       data: {
//         appointments: populatedAppointments,
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


exports.getAppointmentsPag = async (req, res) => {
  try {
    const db = await getDb();
    const appointmentCollection = db.collection('appointments');
    const userCollection = db.collection('users');
    const patientCollection = db.collection('patients');

    const { page = 1, limit = 10, search = '' } = req.query;

    console.log('Query Parameters:appointments', req.query);
    const query = { deleted: { $ne: true } };
    // Apply status filter if provided (excluding 'null' for "All")
     // Apply status filter if provided (excluding 'null' for "All")
    
    
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
   

      // Use aggregation to search for full names (first_name + " " + last_name) for providers
      const providerPipeline = [
        {
          $project: {
            fullName: { $concat: ['$first_name', ' ', '$last_name'] },
            _id: 1,
          },
        },
        {
          $match: {
            fullName: searchRegex,
          },
        },
      ];
      const matchingProviders = await userCollection.aggregate(providerPipeline).toArray();
      const providerIds = matchingProviders.map((p) => p._id);

      // Use aggregation to search for full names (first_name + " " + last_name) for patients
      const patientPipeline = [
        {
          $project: {
            fullName: { $concat: ['$first_name', ' ', '$last_name'] },
            _id: 1,
          },
        },
        {
          $match: {
            fullName: searchRegex,
          },
        },
      ];
      const matchingPatients = await patientCollection.aggregate(patientPipeline).toArray();
      const patientIds = matchingPatients.map((p) => p._id);

      // Also keep individual first_name and last_name searches for backward compatibility
      const individualProviders = await userCollection
        .find(
          {
            $or: [
              { first_name: searchRegex },
              { last_name: searchRegex },
            ],
          },
          { projection: { _id: 1 } }
        )
        .toArray();
      const individualProviderIds = individualProviders.map((p) => p._id);

      const individualPatients = await patientCollection
        .find(
          {
            $or: [
              { first_name: searchRegex },
              { last_name: searchRegex },
            ],
          },
          { projection: { _id: 1 } }
        )
        .toArray();
      const individualPatientIds = individualPatients.map((p) => p._id);

      // Combine full-name and individual-name matches (remove duplicates)
      const uniqueProviderIds = [...new Set([...providerIds, ...individualProviderIds])];
      const uniquePatientIds = [...new Set([...patientIds, ...individualPatientIds])];

      // Update query to include appointments where provider_id or patient_id matches
      if (uniqueProviderIds.length > 0 || uniquePatientIds.length > 0) {
        query.$or = [];
        if (uniqueProviderIds.length > 0) {
          query.$or.push({ provider_id: { $in: uniqueProviderIds } });
        }
        if (uniquePatientIds.length > 0) {
          query.$or.push({ patient_id: { $in: uniquePatientIds } });
        }
      } else {
        // If no matches found in providers or patients, return empty result
        query._id = null; // This ensures no results are returned
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const appointments = await appointmentCollection
      .find(query)
      .sort({ _id: -1 }) // Sort by date descending, then ID
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Populate provider and patient details
    const populatedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const provider = await userCollection.findOne(
          { _id: appt.provider_id },
          { projection: { first_name: 1, last_name: 1, email: 1 } }
        );
        const patient = await patientCollection.findOne(
          { _id: appt.patient_id },
          { projection: { first_name: 1, last_name: 1, email: 1 } }
        );
        return {
          ...appt,
          provider: provider
            ? { first_name: provider.first_name, last_name: provider.last_name, email: provider.email }
            : null,
          patient: patient
            ? { first_name: patient.first_name, last_name: patient.last_name, email: patient.email }
            : null,
        };
      })
    );

    const total = await appointmentCollection.countDocuments(query);

    res.json({
      success: true,
      data: {
        appointments: populatedAppointments,
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
exports.getAppointmentById = async (req, res) => {
  try {
    const db = await getDb();
    const appointmentCollection = db.collection('appointments');
    const userCollection = db.collection('users');
    const patientCollection = db.collection('patients');

    const appointment = await appointmentCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Appointment not found' },
      });
    }

    const provider = await userCollection.findOne({ _id: appointment.provider_id }, { projection: { first_name: 1, last_name: 1, email: 1 } });
    const patient = await patientCollection.findOne({ _id: appointment.patient_id }, { projection: { first_name: 1, last_name: 1, email: 1 } });

    const populatedAppointment = {
      ...appointment,
      provider: provider ? { first_name: provider.first_name, last_name: provider.last_name, email: provider.email } : null,
      patient: patient ? { first_name: patient.first_name, last_name: patient.last_name, email: patient.email } : null,
    };

    res.status(200).json({
      success: true,
      data: populatedAppointment,
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

exports.updateAppointment = async (req, res) => {
  try {
    const db = await getDb();
    const appointmentCollection = db.collection('appointments');
    const userCollection = db.collection('users');
    const patientCollection = db.collection('patients');

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Invalid appointment ID format' },
      });
    }

    const existingAppointment = await appointmentCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Appointment not found' },
      });
    }

    const Data = { ...req.body };
    const validationErrors = validateAppointment(Data);

    if (Object.keys(validationErrors).length !== 0) {
      console.log('Validation errors:', validationErrors); // validation errors

      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Validation failed', details: validationErrors },
      });
    }

    const { provider_id, patient_id, reason, appointment_date, appointment_time, status } = req.body;
    const fieldsToUpdate = {};
    console.log("till heree?")
    if (provider_id && provider_id !== existingAppointment.provider_id.toString()) {
     
      const provider = await userCollection.findOne({ _id: new ObjectId(provider_id) });
      if (!provider) {
        return res.status(400).json({
          success: false,
          data: null,
          error: { message: 'Provider not found' },
        });
      }
      fieldsToUpdate.provider_id = new ObjectId(provider_id);
    }

    if (patient_id && patient_id !== existingAppointment.patient_id.toString()) {
      if (!ObjectId.isValid(patient_id)) {
        return res.status(400).json({
          success: false,
          data: null,
          error: { message: 'Invalid patient ID' },
        });
      } //this is not necessary but keeping to let know.
      const patient = await patientCollection.findOne({ _id: new ObjectId(patient_id) });
      if (!patient) {
        return res.status(400).json({
          success: false,
          data: null,
          error: { message: 'Patient not found' },
        });
      }
      fieldsToUpdate.patient_id = new ObjectId(patient_id);
    }

    if (reason && reason !== existingAppointment.reason) fieldsToUpdate.reason = reason;
    if (appointment_time && appointment_time !== existingAppointment.appointment_time) {
      fieldsToUpdate.appointment_time = appointment_time;
    }
    if (status && status !== existingAppointment.status) fieldsToUpdate.status = status;

    if (appointment_date && appointment_date !== existingAppointment.appointment_date) {
      fieldsToUpdate.appointment_date = appointment_date;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(200).json({
        success: true,
        data: existingAppointment,
        error: null,
        message: 'No changes detected',
      });
    }



    const updatedAppointment = await appointmentCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: fieldsToUpdate },
      { returnDocument: 'after' }
    );

    const populatedAppointment = {
      ...updatedAppointment.value,
      provider: await userCollection.findOne({ _id: updatedAppointment.provider_id }, { projection: { first_name: 1, last_name: 1, email: 1 } }),
      patient: await patientCollection.findOne({ _id: updatedAppointment.patient_id }, { projection: { first_name: 1, last_name: 1, email: 1 } }),
    };

    res.status(200).json({
      success: true,
      data: populatedAppointment,
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

exports.deleteAppointment = async (req, res) => {
  try {
    const db = await getDb();
    const appointmentCollection = db.collection('appointments');

    const result = await appointmentCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { deleted: true } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Appointment not found' },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment soft deleted',
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

//Helper APIs for select cum search
exports.getProviders = async (req, res) => {
  try {
    const db = await getDb();
    const userCollection = db.collection('users');
    const { search = '', page = 1, limit = 10 } = req.query; // Default limit to 4
console.log("query params : in getporviders" ,req.query);
    const query = { deleted: { $ne: true } };
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 4;
    const skip = (pageNum - 1) * limitNum;

    const providers = await userCollection
      .find(query, { projection: { first_name: 1, last_name: 1, email: 1 } })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limitNum) // Limit for dropdown
      .toArray();

    const total = await userCollection.countDocuments(query);
    res.status(200).json({
      success: true,
      data: providers.map(p => ({
        _id: p._id,
        name:`${p.first_name} ${p.last_name}`,
        email: p.email,
      })),
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalRecords: total,
        recordsPerPage: limitNum,
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

exports.getPatients = async (req, res) => {
  try {
    const db = await getDb();
    const patientCollection = db.collection('patients');
    const { search = '', page = 1, limit = 4 } = req.query; // Default limit to 4

    const query = { deleted: { $ne: true } };
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 4;
    const skip = (pageNum - 1) * limitNum;


    const patients = await patientCollection
      .find(query, { projection: { first_name: 1, last_name: 1, email: 1 } })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limitNum) // Limit for dropdown
      .toArray();

      const total = await patientCollection.countDocuments(query);

      res.status(200).json({
        success: true,
        data: patients.map(p => ({
          _id: p._id,
          name: `${p.first_name} ${p.last_name}`,
          email: p.email,
        })),
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalRecords: total,
          recordsPerPage: limitNum,
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


  //Helper APIs for select cum search
exports.getAllProviders = async (req, res) => {
  try {
    const db = await getDb();
    const userCollection = db.collection('users');
    const { search = ''} = req.query; // Default limit to 4
console.log("query params : in getallporviders" ,req.query);
    const query = { deleted: { $ne: true } };
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

   

    const providers = await userCollection
      .find(query, { projection: { first_name: 1, last_name: 1, email: 1 } })
      .sort({ _id: -1 })
      .toArray();

    const total = await userCollection.countDocuments(query);
    res.status(200).json({
      success: true,
      data: providers.map(p => ({
        _id: p._id,
        name: `${p.first_name} ${p.last_name}`,
        email: p.email,
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Server Error: ' + error.message },
    });
  }
};


exports.getAllPatients = async (req, res) => {
  try {
    const db = await getDb();
    const patientCollection = db.collection('patients');
    const { search = '' } = req.query; // Default limit to 4

    const query = { deleted: { $ne: true } };
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }


    const patients = await patientCollection
      .find(query, { projection: { first_name: 1, last_name: 1, email: 1 } })
      .sort({ _id: -1 })
      .toArray();

      const total = await patientCollection.countDocuments(query);

      res.status(200).json({
        success: true,
        data: patients.map(p => ({
          _id: p._id,
          name:`${p.first_name} ${p.last_name}`,
          email: p.email,
        })),
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
  createAppointment: exports.createAppointment,
  getAppointmentsPag: exports.getAppointmentsPag,
  getAppointmentById: exports.getAppointmentById,
  updateAppointment: exports.updateAppointment,
  deleteAppointment: exports.deleteAppointment,
  getProviders: exports.getProviders,
  getPatients: exports.getPatients,
  getAllProviders: exports.getAllProviders,
  getAllPatients: exports.getAllPatients,
  
  
   
};