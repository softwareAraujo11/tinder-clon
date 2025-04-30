// middleware/requireAuth.js
const admin = require('../config/firebaseAdmin');

const requireAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = req.headers.authorization.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Empty token' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.userId = decodedToken.uid; // Attach the user's UID to the request object
        next(); // Proceed to the next middleware or the route handler
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = requireAuth;