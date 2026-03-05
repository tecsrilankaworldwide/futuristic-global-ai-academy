import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n'; // Import i18n before App
import App from './App';
import { Toaster } from './components/ui/sonner';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
