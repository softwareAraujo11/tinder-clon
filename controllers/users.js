// controllers/users.js
let users = [];

const getUsers = (req, res) => {
    res.json(users);
};

const registerUser = (req, res) => {
    const { name, email, password } = req.body;
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);
    res.status(201).json(newUser);
};

module.exports = { getUsers, registerUser, users };