const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  getUsersPag
} = require('../controllers/userController');

const router = express.Router();


router.get('/dbUsers', authenticateToken, getAllUsers);//all existing users in database
router.get('/pusers', authenticateToken, getUsersPag);//users who are not deleted and pagination
router.post('/', authenticateToken, createUser);
router.get('/', authenticateToken, getUsers);//Active-users who are not deleted
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);


module.exports = router;
