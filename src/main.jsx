import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';

axios.interceptors.response.use((response)=>{
  return response;
},
(error)=>{
  const isServeDown=error.code==='ERR_NETWORK'||error.message==='Network error';
  const isUnauthorized=error.response&&(error.response.status===401||error.response.status===403);
  
  if(isServerDown||isUnauthorized){
    sessionStorage.removeItem('user');
    window.dispatchEvent(new Event('storage-update'));
    if(window.location.pathname !== '/login'){
      alert("Session Expired or Server Currently Unavailable. Please log in again.");
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
