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
const SecretVideoSection = lazy(() => import("./SecretVideoSection"));
const Footer = lazy(() => import("./Footer"));
const WebGLGame = React.lazy(() => import("./components/WebGLGame"));

function App() {
  const [isSiteLoading, setIsSiteLoading] = React.useState(true);

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

  useEffect(() => {
    let mounted = true;

    const preloadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });

    const preloadVideo = (src) =>
      new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadeddata = () => resolve(true);
        video.onerror = () => resolve(false);
        video.src = src;
      });

    const gatherMediaAssets = () => {
      const mems = require.context("./icons/mems", false, /\.(png|jpe?g|gif|webp)$/i);
      const icons = require.context("./icons", false, /\.(png|jpe?g|gif|webp|webm|mp4)$/i);
      return [...mems.keys().map(mems), ...icons.keys().map(icons)];
    };

    const startLoading = async () => {
      const minDelay = new Promise((resolve) => window.setTimeout(resolve, 1200));
      const urls = gatherMediaAssets();
      const preloadTasks = urls.map((url) =>
        /\.(mp4|webm)$/i.test(url) ? preloadVideo(url) : preloadImage(url)
      );

      await Promise.all([...preloadTasks, minDelay]);
      if (mounted) setIsSiteLoading(false);
    };

    startLoading();

    const fallbackTimer = window.setTimeout(() => {
      if (mounted) setIsSiteLoading(false);
    }, 9000);

    return () => {
      mounted = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (isSiteLoading) {
    return (
      <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full border-4 border-slate-300 border-t-sky-500 animate-spin" />
          <p className="mt-4 text-slate-700 text-lg">Загрузка сайта...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <AnimationProvider>
          <Router>
            <div className="relative min-h-screen overflow-x-hidden bg-[#eef2f7]">
              <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-sky-100/80 blur-3xl" />
                <div className="absolute top-[22%] right-[-120px] h-[360px] w-[360px] rounded-full bg-violet-100/70 blur-3xl" />
                <div className="absolute bottom-[-120px] left-[18%] h-[380px] w-[380px] rounded-full bg-amber-50/80 blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent" />
              </div>
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
                        <SecretVideoSection />
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
