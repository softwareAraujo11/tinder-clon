// components/UserFilter.js
import React, { useState } from 'react';

const UserFilter = () => {
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const query = new URLSearchParams();
      if (location) query.append('location', location);
      if (interests) query.append('interests', interests);

      const res = await fetch(`http://localhost:3000/api/users?${query.toString()}`);
      const data = await res.json();
      setFilteredUsers(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="filter-container">
      <h2>Find People by Region and Interests</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter location (e.g., Bogotá)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter interests (comma separated)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <hr />

      {loading && <p>Loading...</p>}
      {!loading && filteredUsers.length === 0 && <p>No users found.</p>}
      <ul>
        {filteredUsers.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong> ({user.location})<br />
            Interests: {user.interests?.join(', ') || 'None'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFilter;
