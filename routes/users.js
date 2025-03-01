// routes/users.js
const express = require('express');
const { getUsers, registerUser } = require('../controllers/users');
const router = express.Router();

router.get('/', getUsers); // Obtener usuarios disponibles
router.post('/', registerUser); // Registrar usuario

module.exports = router;