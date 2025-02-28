const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getAppointmentsPag, createAppointment, getProviders, getAppointmentById, updateAppointment, deleteAppointment, getPatients, getAllProviders, getAllPatients } = require('../controllers/appointmentController');

const router = express.Router();



router.get('/pusers', authenticateToken, getAppointmentsPag);//users who are not deleted and pagination
router.post('/', authenticateToken, createAppointment);

router.get('/providers', authenticateToken, getProviders);// For select cum search
router.get('/Allpatients', authenticateToken, getAllPatients);// For select cum search

router.get('/Allproviders', authenticateToken, getAllProviders);// For select cum search
router.get('/patients', authenticateToken, getPatients);// For select cum search

router.get('/:id', authenticateToken, getAppointmentById);
router.put('/:id', authenticateToken, updateAppointment);
router.delete('/:id', authenticateToken, deleteAppointment);


module.exports = router;
