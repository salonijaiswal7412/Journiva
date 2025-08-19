import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import OAuthSuccess from './pages/authSuccess/authSuccess.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<App />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
    </Routes>
  </BrowserRouter>
);
