import React, { lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import CursorLight from './CursorLight';
import { AuthProvider } from './contexts/AuthContext';
import { AnimationProvider } from './config/animations';
import CachedRoute from './components/CachedRoute';
import './index.css';

// Lazy load components
const Header = lazy(() => import('./Header'));
const About = lazy(() => import('./About'));
const Projects = lazy(() => import('./Projects'));
const Contact = lazy(() => import('./Contact'));
const Footer = lazy(() => import('./Footer'));
const Profile = lazy(() => import('./Profile'));

function App() {
  return (
    <AuthProvider>
      <AnimationProvider>
        <Router>
          <div className="min-h-screen bg-[#121212]">
            <CursorLight />
            <Navbar />
            <Routes>
              <Route path="/profile" element={
                <CachedRoute>
                  <div className="pt-16">
                    <Profile />
                  </div>
                </CachedRoute>
              } />
              <Route path="/" element={
                <CachedRoute>
                  <main className="h-screen snap-y snap-mandatory overflow-y-auto scroll-pt-16">
                    <Header />
                    <About />
                    <Projects />
                    <Contact />
                    <Footer />
                  </main>
                </CachedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AnimationProvider>
    </AuthProvider>
  );
}

export default App;
