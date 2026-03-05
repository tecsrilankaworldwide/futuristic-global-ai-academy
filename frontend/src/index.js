import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n'; // Import i18n before App
import App from './App';
import { Toaster } from './components/ui/sonner';

// Suppress ResizeObserver error (common browser issue, not app-breaking)
window.addEventListener('error', (e) => {
  if (e.message.includes('ResizeObserver') || e.message.includes('ResizeObserver loop')) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
