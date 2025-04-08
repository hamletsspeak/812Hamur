import React, { Suspense, lazy } from 'react';
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
const Auth = lazy(() => import('./components/Auth'));
const Profile = lazy(() => import('./Profile'));

// Получаем basename из package.json homepage или используем '/'
const basename = process.env.PUBLIC_URL || '/';

const PageLoader = () => (
  <div className="min-h-screen bg-[#121212] flex items-center justify-center">
    <div className="space-y-6 w-full max-w-md p-4">
      <div className="h-8 bg-gray-700 rounded-lg animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  </div>
);

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
