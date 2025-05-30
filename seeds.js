// seeds.js
require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const admin = require('firebase-admin');
const User = require('./models/User');
const serviceAccount = require('./firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const generateUsers = async () => {
  const usuarios = [];

  for (let i = 0; i < 50; i++) {
    const name = faker.person.fullName();
    const email = `user${i}@test.com`;
    const password = `Password${i}`;
    const uuid = faker.string.uuid();

    const profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff5864&color=fff&size=128`;

    let firebaseUser;

    try {
      firebaseUser = await admin.auth().getUserByEmail(email);

      await admin.auth().updateUser(firebaseUser.uid, {
        displayName: name,
        photoURL: profilePicture
      });

      console.log(`🔁 Usuario actualizado en Firebase: ${email}`);
    } catch (error) {
      firebaseUser = await admin.auth().createUser({
        uid: uuid,
        email,
        password,
        displayName: name,
        photoURL: profilePicture
      });

      console.log(`✅ Usuario creado en Firebase: ${email}`);
    }

    const userData = {
      uuid: firebaseUser.uid,
      name,
      email,
      password,
      profilePicture,
      age: faker.number.int({ min: 18, max: 40 }),
      gender: faker.helpers.arrayElement(['male', 'female']),
      location: faker.helpers.arrayElement([
        'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla', 'Bucaramanga', 'Pasto', 'Mocoa'
      ]),
      interests: faker.helpers.arrayElements([
        'Fútbol', 'Música', 'Viajes', 'Cine', 'Lectura', 'Tecnología', 'Moda', 'Videojuegos', 'Baile'
      ], 2)
    };

    await User.findOneAndUpdate({ email }, userData, { upsert: true, new: true });
  }

  console.log('🎯 Usuarios sincronizados en Firebase y MongoDB');
};

connectDB()
  .then(generateUsers)
  .then(() => mongoose.disconnect());
