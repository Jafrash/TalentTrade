import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './util/userContext';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar';

// NOTE: This file is not used as the main app entry point. See App.jsx for main routing.
function App() {
  return (
    <Router>
      <UserContextProvider>
        <div className="min-h-screen bg-[#2D2D2D]">
          <Navbar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </UserContextProvider>
    </Router>
  );
}

export default App;
