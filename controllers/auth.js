// controllers/auth.js
const usersModule = require('./users');

const loginUser = (req, res) => {
    const { email, password } = req.body;
    const user = usersModule.users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

module.exports = { loginUser };