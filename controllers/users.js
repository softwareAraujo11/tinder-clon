// controllers/users.js

/**
 * Almacenamiento temporal de usuarios en memoria.
 * En un entorno real, estos datos deberían almacenarse en una base de datos.
 */
let users = [];

/**
 * @function getUsers
 * @desc    Obtiene la lista de usuarios registrados.
 * @route   GET /api/users
 * @access  Público
 * @returns {Array} Lista de usuarios en formato JSON.
 */
const getUsers = (req, res) => {
    res.json(users);
};

/**
 * @function registerUser
 * @desc    Registra un nuevo usuario en el sistema.
 * @route   POST /api/users
 * @access  Público
 * @body    { name: string, email: string, password: string }
 *          - `name`: Nombre del usuario.
 *          - `email`: Correo electrónico único del usuario.
 *          - `password`: Contraseña del usuario (sin encriptar).
 * @returns {Object} Datos del usuario recién creado en formato JSON.
 */
const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    // Creación del nuevo usuario con un ID único
    const newUser = { id: users.length + 1, name, email, password };

    // Almacenar el usuario en la lista
    users.push(newUser);

    // Responder con el usuario creado
    res.status(201).json(newUser);
};

// Exportación de funciones y lista de usuarios
module.exports = { getUsers, registerUser, users };
