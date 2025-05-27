// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBObQj7SKFaiG0b0llG2YcUHSDqBB5KhQ8",
  authDomain: "tinderclone-dc428.firebaseapp.com",
  projectId: "tinderclone-dc428",
  storageBucket: "tinderclone-dc428.firebasestorage.app",
  messagingSenderId: "151199502112",
  appId: "1:151199502112:web:029a077d5c49a319f49145"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
