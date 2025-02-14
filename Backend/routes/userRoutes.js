const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} = require('../controllers/userController');

const router = express.Router();

router.post('/', authenticateToken, createUser);
router.get('/dbUsers', authenticateToken, getAllUsers);//all existing users in database
router.get('/', authenticateToken, getUsers);//users who are not deleted
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
