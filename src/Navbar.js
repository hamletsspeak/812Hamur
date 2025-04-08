import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
  };

  const mainLinks = [
    { id: 'about', text: 'Обо мне' },
    { id: 'projects', text: 'Проекты' },
    { id: 'contact', text: 'Контакты' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1f1f1f]/95 backdrop-blur-sm flex justify-between items-center px-6 py-4 z-50 shadow-lg">
      <button onClick={handleLogoClick} className="text-white text-2xl font-semibold hover:text-blue-400 transition-colors duration-300">
        Гамлет
      </button>

      <div className="sm:hidden relative z-50" onClick={toggleMenu}>
        <div className="space-y-2 cursor-pointer">
          <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
          <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
        </div>
      </div>

      <ul className={`${
        menuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      } fixed sm:relative top-0 left-0 h-screen sm:h-auto w-full sm:w-auto bg-[#1f1f1f]/95 sm:bg-transparent flex flex-col sm:flex-row items-center justify-center gap-8 text-white transition-transform duration-300 backdrop-blur-sm sm:backdrop-blur-none`}>
        {location.pathname === '/' && mainLinks.map(link => (
          <li key={link.id}>
            <a 
              href={`#${link.id}`}
              onClick={(e) => handleScroll(e, link.id)}
              className="text-lg hover:text-blue-400 transition-colors duration-300 py-2 sm:py-0 block px-4 sm:px-0"
            >
              {link.text}
            </a>
          </li>
        ))}
        <li>
          <Link 
            to="/profile" 
            onClick={handleAuthClick}
            className="text-lg hover:text-blue-400 transition-colors duration-300 py-2 sm:py-0 block px-4 sm:px-0"
          >
            {user ? 'Профиль' : 'Авторизация'}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
