import React, { lazy, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { AnimationProvider } from "./config/animations";
import CachedRoute from "./components/CachedRoute";
import CookieConsent from "./components/CookieConsent";
import { LanguageProvider } from "./contexts/LanguageContext";
import AIAssistant from "./components/AIAssistant";
import "./index.css";

// Lazy load components
const Header = lazy(() => import("./Header"));
const About = lazy(() => import("./About"));
const Projects = lazy(() => import("./Projects"));
const Contact = lazy(() => import("./Contact"));
const Footer = lazy(() => import("./Footer"));
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
            <div className="min-h-screen bg-[#eef2f7]">
              <Navbar />
              <Routes>
                <Route
                  path="/webgl-game"
                  element={
                    <CachedRoute>
                      <WebGLGame />
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
              <AIAssistant />
            </div>
          </Router>
        </AnimationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
