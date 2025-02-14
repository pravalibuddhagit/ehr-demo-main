const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
 getManagerById,
 updateManager,
 deleteManager,
 getAllManagers
} = require('../controllers/managerController');

const router = express.Router();

router.get('/dbUsers', authenticateToken, getAllManagers);//all existing users in database
// router.get('/', authenticateToken, getUsers);//users who are not deleted
router.get('/:id', authenticateToken, getManagerById);
router.put('/:id', authenticateToken, updateManager);
router.delete('/:id', authenticateToken, deleteManager);

module.exports = router;