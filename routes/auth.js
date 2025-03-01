// routes/auth.js
const express = require('express');
const { loginUser } = require('../controllers/auth');
const router = express.Router();

router.post('/login', loginUser); // Autenticación de usuario

module.exports = router;