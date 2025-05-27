// routes/users.js
const express = require('express');
const router = express.Router();
const { registerOrUpdateUser, getUsers, updateUser } = require('../controllers/users');

router.post('/', registerOrUpdateUser);
router.get('/', getUsers);
router.put('/:id', updateUser);

module.exports = router;
