import React from 'react';
import './styles/App.css';
import Chat from './components/Chat';

function App() {
  return (
    <div className="App">
      <header className="App-header-small">
        <h1>Chat Tinder</h1>
      </header>
      <main>
        <Chat />
      </main>
    </div>
  );
}

export default App;