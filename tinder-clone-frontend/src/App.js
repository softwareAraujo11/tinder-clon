// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthMenu from './components/AuthMenu';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import CompleteProfile from './components/CompleteProfile';
import UserFilter from './components/UserFilter';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header-small">
          <h1>Chat Tinder</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<AuthMenu />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/filter" element={<UserFilter />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
