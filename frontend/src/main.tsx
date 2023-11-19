import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

import Cookies from 'universal-cookie'

const cookies = new Cookies();

axios.interceptors.request.use(
  (config) => {

    const token = cookies.get('token');
    if (token) {
      config.headers['Girder-Token'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
