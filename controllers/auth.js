// controllers/auth.js

/**
 * Importación del módulo de usuarios, donde se almacena la lista de usuarios en memoria.
 */
const usersModule = require('./users');

/**
 * @function loginUser
 * @desc    Permite a un usuario autenticarse mediante email y contraseña.
 * @route   POST /api/auth/login
 * @access  Público
 * @body    { email: string, password: string }
 *          - `email`: Correo electrónico del usuario.
 *          - `password`: Contraseña del usuario.
 * @returns {Object} Mensaje de autenticación y datos del usuario si es exitoso.
 *          - `message`: Mensaje de confirmación o error.
 *          - `user` (opcional): Objeto con los datos del usuario autenticado.
 */
const loginUser = (req, res) => {
    const { email, password } = req.body;

    // Buscar al usuario en la lista de usuarios por email y password
    const user = usersModule.users.find(u => u.email === email && u.password === password);

    // Si el usuario existe, enviar datos de autenticación
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// Exportación de la función para su uso en el router
module.exports = { loginUser };
