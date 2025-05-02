// app.js
// Importa React, necesario para crear componentes
import React from 'react';
// Importa los estilos específicos de este componente
import './styles/App.css';
// Importa el componente de Chat, que representa el sistema de mensajería
import Chat from './components/Chat';

// Componente principal de la aplicación
function App() {
  return (
    <div className="App">
      {/* Encabezado de la aplicación */}
      <header className="App-header-small">
        <h1>Chat Tinder</h1>
      </header>

      {/* Contenido principal donde se carga el componente de chat */}
      <main>
        <Chat />
      </main>
    </div>
  );
}

// Exporta el componente para que pueda ser usado en index.js
export default App;
