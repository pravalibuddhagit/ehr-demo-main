const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  createPatient,
  getPatientById,
  deletePatient,
  getPatientsPag
} = require('../controllers/patientController');

const router = express.Router();


// router.get('/dbUsers', authenticateToken, getAllPatients);all existing users in database
// router.get('/', authenticateToken, getPatient);users who are not deleted :-active users
// router.put('/:id', authenticateToken, updateUser);

router.delete('/:id', authenticateToken,  deletePatient);
router.get('/pusers', authenticateToken, getPatientsPag);//users who are not deleted and pagination
router.post('/', authenticateToken,  createPatient);
router.get('/:id', authenticateToken,getPatientById);

module.exports = router;
