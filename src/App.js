import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreatorView from './pages/CreatorView';
import DashboardView from './pages/DashboardView';
import ConsumerView from './pages/ConsumerView';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('Loaded from storage:', { token, role }); // Debug storage
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);
  return (
    <>
      <Router>
        <Navbar 
          isAuthenticated={isAuthenticated} 
          userRole={userRole} 
          onLogout={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setIsAuthenticated(false);
            setUserRole('');
          }} 
        />
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={(role) => {
                console.log('Role received:', role); // Check the role
            setIsAuthenticated(true);
            setUserRole(role);
          }} /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<ConsumerView />} />
          <Route 
            path="/creator" 
            element={isAuthenticated && userRole === 'creator' ? <CreatorView/> : <Navigate to="/" />} 
          />
           <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardView /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
