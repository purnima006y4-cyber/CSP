import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Context
import { AuthProvider } from './context/AuthContext';

// Components
import AppNavbar from './components/Navbar';
import AppFooter from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import Home from './pages/user/Home';
import About from './pages/user/About';
import Services from './pages/user/Services';
import Contact from './pages/user/Contact';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import UserDashboard from './pages/user/UserDashboard';
import RegisterComplaint from './pages/user/RegisterComplaint';
import TrackComplaint from './pages/user/TrackComplaint';
import MyComplaints from './pages/user/MyComplaints';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageComplaints from './pages/admin/ManageComplaints';
import ManageUsers from './pages/admin/ManageUsers';
import Reports from './pages/admin/Reports';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <main>
          <Routes>
            {/* Public User Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<TrackComplaint />} />

            {/* Protected Resident Pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/new"
              element={
                <ProtectedRoute role="user">
                  <RegisterComplaint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-complaints"
              element={
                <ProtectedRoute role="user">
                  <MyComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute role="user">
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Pages */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute role="admin">
                  <ManageComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute role="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AppFooter />
      </Router>
    </AuthProvider>
  );
}
