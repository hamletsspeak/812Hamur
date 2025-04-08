import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import './index.css';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import Navbar from './Navbar';
import Footer from './Footer';
import CursorLight from './CursorLight';
import Auth from './components/Auth';
import Profile from './Profile';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CursorLight />
        <Navbar />
        <Routes>
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={
            <main className="snap-y snap-mandatory h-screen overflow-y-auto scroll-pt-16">
              <Header />
              <Auth />
              <ProtectedRoute>
                <About />
                <Projects />
                <Contact />
              </ProtectedRoute>
              <Footer />
            </main>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
