import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import { m, AnimatePresence } from "framer-motion";
import Auth from './components/Auth';

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
    { id: 'about', text: 'About' },
    { id: 'projects', text: 'Projects' },
    { id: 'contact', text: 'Contact' }
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
        className="fixed top-0 left-0 w-full bg-[#1f1f1f]/95 backdrop-blur-sm flex justify-between items-center px-6 py-4 z-50 shadow-lg navbar-font"
      >
        <m.button 
          onClick={handleLogoClick} 
          className="text-white text-2xl font-semibold hover:text-blue-400 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Hamlet
        </m.button>


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

        <AnimatePresence>
          {(menuOpen || window.innerWidth > 640) && (
            <m.ul
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className={`fixed sm:relative top-0 left-0 h-screen sm:h-auto w-full sm:w-auto bg-[#1f1f1f]/95 sm:bg-transparent flex flex-col sm:flex-row items-center justify-center gap-8 text-white will-change-transform backdrop-blur-sm sm:backdrop-blur-none`}
            >
              {location.pathname === '/' && mainLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={`#${link.id}`}
                  onClick={(e) => handleScroll(e, link.id)}
                >
                  {link.text}
                </NavLink>
              ))}
              <m.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <button
                  onClick={handleAuthClick}
                  className="text-lg text-white hover:text-blue-400 transition-colors duration-300 py-2 sm:py-0 block px-4 sm:px-0 relative"
                  style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
                  type="button"
                >
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400"
                    style={{ display: 'block' }}
                  />
                  {user ? 'Profile' : 'Sign In / Register'}
                </button>
              </m.li>
            </m.ul>
          )}
        </AnimatePresence>
      </m.nav>

      <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Navbar;
