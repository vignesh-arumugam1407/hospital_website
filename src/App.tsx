/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes';
import { autoSeedDatabase } from './lib/seedData';
import { getRedirectResult } from "firebase/auth";
import { auth } from "./lib/firebase";

// Pages
import { Home } from './pages/Home';
import { Departments } from './pages/Departments';
import { Doctors } from './pages/Doctors';
import { DoctorProfile } from './pages/DoctorProfile';
import { BookAppointment } from './pages/BookAppointment';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';


export default function App() {
  useEffect(() => {
    autoSeedDatabase();
    
    // Check for redirect result from Firebase auth
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("User:", result.user);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/departments" element={<Departments />} />
              
              {/* Protected Routes */}
              <Route path="/doctors" element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              } />
              <Route path="/doctors/:id" element={
                <ProtectedRoute>
                  <DoctorProfile />
                </ProtectedRoute>
              } />
              <Route path="/book" element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
