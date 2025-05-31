import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import { m, AnimatePresence } from "framer-motion";
import Auth from './components/Auth';
import { useLanguage } from "./contexts/LanguageContext";

const NavLink = ({ to, onClick, children }) => (
  <m.li
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    whileHover={{ scale: 1.1 }}
    transition={{
      type: "spring",
      stiffness: 400,
      damping: 25
    }}
  >
    {to.startsWith('#') ? (
      <m.a 
        href={to}
        onClick={onClick}
        className="text-lg text-white hover:text-blue-400 transition-colors duration-300 py-2 sm:py-0 block px-4 sm:px-0 relative"
        whileHover={{ x: 5 }}
      >
        <m.span
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400"
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.2 }}
        />
        {children}
      </m.a>
    ) : (
      <Link
        to={to}
        onClick={onClick}
        className="text-lg text-white hover:text-blue-400 transition-colors duration-300 py-2 sm:py-0 block px-4 sm:px-0 relative"
      >
        <m.span
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400"
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.2 }}
        />
        {children}
      </Link>
    )}
  </m.li>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleScroll = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthClick = () => {
    setMenuOpen(false);
    if (user) {
      navigate('/profile');
    } else {
      setShowAuth(true);
    }
  };

  const mainLinks = [
    { id: 'about', text: t('aboutTitle') },
    { id: 'projects', text: t('projectsTitle') },
    { id: 'contact', text: t('contactsTitle') }
  ];

  return (
    <>
      <m.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="fixed top-0 left-0 w-full bg-[#1f1f1f]/95 backdrop-blur-sm flex justify-between items-center px-6 py-4 z-50 shadow-lg navbar-font h-20 sm:h-20 md:h-20"
      >
        <m.button 
          onClick={handleLogoClick} 
          className="text-white text-2xl font-semibold hover:text-blue-400 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Hamlet
        </m.button>
        <div className="hidden sm:flex flex-1 justify-end items-center">
          <ul className="flex gap-8 items-center">
            {mainLinks.map((link) => (
              <NavLink
                key={link.id}
                to={`#${link.id}`}
                onClick={(e) => handleScroll(e, link.id)}
              >
                {link.text}
              </NavLink>
            ))}
            {user && (
              <NavLink to="/profile" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>
                {t('profile')}
              </NavLink>
            )}
            {!user && (
              <li>
                <button
                  onClick={handleAuthClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 shadow-md"
                >
                  {t('loginOrRegister')}
                </button>
              </li>
            )}
            <li>
              <button
                className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-300 tracking-wide text-base flex items-center gap-2 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-95"
                onClick={() => window.open('game/index.html', '_blank')}
              >
                {t('openGame')}
              </button>
            </li>
            <li>
              <button
                onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                className="flex items-center gap-2 px-3 py-2 rounded bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white transition-colors font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Switch language"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 0c2.21 0 4 4.03 4 9s-1.79 9-4 9-4-4.03-4-9 1.79-9 4-9zm0 0v18" />
                </svg>
                <span className="font-bold">{language.toUpperCase()}</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="sm:hidden relative z-50">
          <m.button
            onClick={toggleMenu}
            className="space-y-2 cursor-pointer"
            whileTap={{ scale: 0.9 }}
          >
            <m.span 
              className="block w-8 h-0.5 bg-white" 
              animate={{ 
                rotate: menuOpen ? 45 : 0,
                translateY: menuOpen ? 10 : 0
              }}
              transition={{ duration: 0.3 }}
            />
            <m.span 
              className="block w-8 h-0.5 bg-white"
              animate={{ 
                opacity: menuOpen ? 0 : 1
              }}
              transition={{ duration: 0.3 }}
            />
            <m.span 
              className="block w-8 h-0.5 bg-white"
              animate={{ 
                rotate: menuOpen ? -45 : 0,
                translateY: menuOpen ? -10 : 0
              }}
              transition={{ duration: 0.3 }}
            />
          </m.button>
        </div>
        {/* Мобильное меню */}
        <AnimatePresence>
          {menuOpen && (
            <m.ul
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="fixed top-0 left-0 h-screen w-full bg-[#1f1f1f]/95 flex flex-col items-center justify-center gap-8 text-white will-change-transform backdrop-blur-sm z-40"
            >
              {mainLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={`#${link.id}`}
                  onClick={(e) => handleScroll(e, link.id)}
                >
                  {link.text}
                </NavLink>
              ))}
              {user && (
                <NavLink to="/profile" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>
                  {t('profile')}
                </NavLink>
              )}
              <li>
                <button
                  onClick={handleAuthClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 shadow-md w-full"
                >
                  {t('loginOrRegister')}
                </button>
              </li>
              <li>
                <button
                  className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-300 tracking-wide text-base flex items-center gap-2 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-95 w-full"
                  onClick={() => window.open('game/index.html', '_blank')}
                >
                  {t('openGame')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white transition-colors font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-400 w-full justify-center"
                  aria-label="Switch language"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 0c2.21 0 4 4.03 4 9s-1.79 9-4 9-4-4.03-4-9 1.79-9 4-9zm0 0v18" />
                  </svg>
                  <span className="font-bold">{language.toUpperCase()}</span>
                </button>
              </li>
            </m.ul>
          )}
        </AnimatePresence>
      </m.nav>

      <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Navbar;
