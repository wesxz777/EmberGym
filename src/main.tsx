import React from 'react';
import { createRoot } from 'react-dom/client';

// Looking in the same directory for the styles folder
import './styles/index.css';
// Looking in the same directory for the app folder
import App from './app/App';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);