// utils/syncUser.js
export const syncUserWithBackend = async (firebaseUser) => {
  const { uid, email, displayName, photoURL } = firebaseUser;

  try {
    const response = await fetch('http://localhost:3000/api/users');
    const users = await response.json();

    const exists = users.find((user) => user.email === email);
    if (exists) {
      return { exists: true, user: exists };
    }

    const newUser = {
      name: displayName || 'New User',
      email: email,
      password: uid,
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
    return null;
  }
};
