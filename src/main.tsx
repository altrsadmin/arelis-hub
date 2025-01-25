import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Elemento root para renderização
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento root não encontrado. A aplicação não pode ser inicializada.');
}

// Criação do root React
const root = ReactDOM.createRoot(rootElement);

// Renderização da aplicação
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);