import { useState } from 'react'
import React from 'react';
import './App.css'
import HomePage from './pages/homepage';
import LoginPage from './pages/login';
import {
  BrowserRouter as Router,
  Route, Routes
} from "react-router-dom";
import UserPage from './pages/userhome';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App
