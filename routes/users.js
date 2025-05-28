// routes/users.js
const express = require('express');
const router = express.Router();
const {
  registerOrUpdateUser,
  getUsers,
  getSuggestedUsers,
  updateUser,
  getUserByUuid
} = require('../controllers/users');

router.post('/', registerOrUpdateUser);
router.get('/', getUsers);
router.get('/suggested/:uuid', getSuggestedUsers); // ✅ esta debe estar antes
router.get('/:uuid', getUserByUuid);
router.put('/:uuid', updateUser);

module.exports = router;
