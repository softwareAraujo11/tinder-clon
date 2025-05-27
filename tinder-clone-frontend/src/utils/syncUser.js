// utils/syncUser.js
export const syncUserWithBackend = async (firebaseUser) => {
  const { uid, email, displayName, photoURL } = firebaseUser;

  try {
    // Verifica si el usuario ya existe en MongoDB (por email)
    const response = await fetch('http://localhost:3000/api/users');
    const users = await response.json();

    const exists = users.find((user) => user.email === email);
    if (exists) {
      return { exists: true, user: exists };
    }

    // Si no existe, crea uno nuevo con info básica (completa luego el perfil)
    const newUser = {
      name: displayName || 'New User',
      email: email,
      password: uid, // Puedes usar el UID de Firebase como contraseña temporal
      profilePicture: photoURL || '',
      age: null,
      gender: '',
      location: '',
      interests: []
    };

    const createRes = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    const createdUser = await createRes.json();
    return { exists: false, user: createdUser };
  } catch (error) {
    console.error('Error syncing user with backend:', error);
    return null;
  }
};
