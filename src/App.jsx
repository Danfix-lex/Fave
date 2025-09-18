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
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import VerifyEmail from './pages/VerifyEmail';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import KYC from './pages/KYC';
import About from './pages/About';
import Contact from './pages/Contact';
import Upcoming from './pages/Upcoming';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import PaymentSuccess from './pages/PaymentSuccess';
import AuthenticatedRedirect from './components/AuthenticatedRedirect';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MusicalBackground />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes with header and footer */}
            <Route path="/" element={
              <AuthenticatedRedirect>
                <Header />
                <Landing />
                <Footer />
              </AuthenticatedRedirect>
            } />
            <Route path="/about" element={
              <AuthenticatedRedirect>
                <Header />
                <About />
                <Footer />
              </AuthenticatedRedirect>
            } />
            <Route path="/contact" element={
              <AuthenticatedRedirect>
                <Header />
                <Contact />
                <Footer />
              </AuthenticatedRedirect>
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
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/verify-otp" element={<OTPVerification />} />
            {/* KYC route (protected but doesn't require KYC completion) */}
            <Route
              path="/kyc"
              element={
                <ProtectedRoute>
                  <KYC />
                </ProtectedRoute>
              }
            />
            {/* Admin Dashboard route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Profile route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
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
              <Route path="profile" element={<Profile />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="unauthorized" element={<div>Unauthorized Access</div>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;