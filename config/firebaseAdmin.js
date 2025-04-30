const admin = require('firebase-admin');

// Ruta al archivo serviceAccountKey.json
const serviceAccount = require('../credentials/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;