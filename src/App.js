import React, { lazy, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import CursorLight from "./CursorLight";
import { AuthProvider } from "./contexts/AuthContext";
import { AnimationProvider } from "./config/animations";
import CachedRoute from "./components/CachedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import CookieConsent from "./components/CookieConsent";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./index.css";

// Lazy load components
const Header = lazy(() => import("./Header"));
const About = lazy(() => import("./About"));
const Projects = lazy(() => import("./Projects"));
const Contact = lazy(() => import("./Contact"));
const Footer = lazy(() => import("./Footer"));
const Profile = lazy(() => import("./Profile"));
const ProfileSetup = lazy(() => import("./components/ProfileSetup"));
const WebGLGame = React.lazy(() => import("./components/WebGLGame"));

function App() {
  useEffect(() => {
    if (!localStorage.getItem("userLocation")) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };
            localStorage.setItem("userLocation", JSON.stringify(coords));
          },
          (err) => {
            localStorage.setItem("userLocation", "denied");
          },
          { enableHighAccuracy: false, timeout: 10000 }
        );
      } else {
        localStorage.setItem("userLocation", "unsupported");
      }
    }
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <AnimationProvider>
          <Router>
            <div className="min-h-screen bg-[#121212]">
              <CursorLight />
              <Navbar />
              <Routes>
                <Route
                  path="/profile"
                  element={
                    <CachedRoute>
                      <ProtectedRoute>
                        <div className="pt-16">
                          <Profile />
                        </div>
                      </ProtectedRoute>
                    </CachedRoute>
                  }
                />
                <Route
                  path="/webgl-game"
                  element={
                    <CachedRoute>
                      <WebGLGame />
                    </CachedRoute>
                  }
                />
                <Route
                  path="/profile-setup"
                  element={
                    <CachedRoute>
                      <ProtectedRoute>
                        <div className="pt-16">
                          <ProfileSetup />
                        </div>
                      </ProtectedRoute>
                    </CachedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <CachedRoute>
                      <main>
                        <Header />
                        <About />
                        <Projects />
                        <Contact />
                        <Footer />
                      </main>
                    </CachedRoute>
                  }
                />
              </Routes>
              <CookieConsent />
            </div>
          </Router>
        </AnimationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
