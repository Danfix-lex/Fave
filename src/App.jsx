import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import MusicalBackground from './components/MusicalBackground';
import BackendStatus from './components/BackendStatus';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import KYC from './pages/KYC';
import About from './pages/About';
import Contact from './pages/Contact';
import Upcoming from './pages/Upcoming';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MusicalBackground />
      <BackendStatus />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes with header and footer */}
            <Route path="/" element={
              <>
                <Header />
                <Landing />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Header />
                <About />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <Contact />
                <Footer />
              </>
            } />
            <Route path="/upcoming" element={
              <>
                <Header />
                <Upcoming />
                <Footer />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* KYC route (protected but doesn't require KYC completion) */}
            <Route
              path="/kyc"
              element={
                <ProtectedRoute>
                  <KYC />
                </ProtectedRoute>
              }
            />

            {/* Protected routes with layout that require KYC completion */}
            <Route
              path="/*"
              element={
                <ProtectedRoute requireKYC={true}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
              <Route path="unauthorized" element={<div>Unauthorized Access</div>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;