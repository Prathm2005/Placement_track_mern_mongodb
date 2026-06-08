import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from './pages/Login';
import Register from './pages/Register';
import DSATracker from './pages/DSATracker';
import JobTracker from './pages/JobTracker';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {  // ✅ small c
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />  // ✅ small c
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dsa"      element={<PrivateRoute><DSATracker /></PrivateRoute>} />
        <Route path="/jobs"     element={<PrivateRoute><JobTracker /></PrivateRoute>} />
        <Route path="*"         element={<Navigate to={user ? "/dsa" : "/login"} />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App