// routes/users.js
const express = require('express');
const router = express.Router();

const {
  registerOrUpdateUser,
  getUsers,
  getSuggestedUsers,
  updateUser,
  getUserByEmail
} = require('../controllers/users');

router.post('/register', registerOrUpdateUser);
router.get('/', getUsers);
router.get('/suggested/:uuid', getSuggestedUsers);
router.put('/:uuid', updateUser);
router.get('/email/:email', getUserByEmail);

module.exports = router;
