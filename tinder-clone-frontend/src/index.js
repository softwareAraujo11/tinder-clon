// index.js
// Importa React, la biblioteca principal para construir interfaces de usuario
import React from 'react';
// Importa ReactDOM para renderizar la aplicación en el DOM
import ReactDOM from 'react-dom/client';
// Importa el archivo de estilos globales
import './styles/index.css';
// Importa el componente principal de la aplicación
import App from './App';

// Crea el punto de entrada de la aplicación React y lo monta en el elemento con id="root" del HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza el componente App dentro del modo estricto de React (React.StrictMode)
// Esto ayuda a detectar errores potenciales y prácticas obsoletas en desarrollo
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
