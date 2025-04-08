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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
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

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1f1f1f] flex justify-between items-center px-4 py-2 z-50">
      <button onClick={handleLogoClick} className="text-white text-2xl font-semibold hover:opacity-80 transition-opacity">
        Гамлет
      </button>

      <div className="sm:hidden" onClick={toggleMenu}>
        <div className="space-y-2">
          <span className="block w-8 h-0.5 bg-white"></span>
          <span className="block w-8 h-0.5 bg-white"></span>
          <span className="block w-8 h-0.5 bg-white"></span>
        </div>
      </div>

      <ul className={`${
        menuOpen ? "block" : "hidden"
      } sm:flex gap-8 text-white absolute sm:static top-16 left-0 w-full sm:w-auto bg-[#1f1f1f] sm:bg-transparent py-2`}>
        <li>
          <a 
            href="#about" 
            onClick={(e) => handleScroll(e, 'about')}
            className="hover:underline py-2 sm:py-0 block px-4 sm:px-0"
          >
            Обо мне
          </a>
        </li>
        <li>
          <a 
            href="#projects" 
            onClick={(e) => handleScroll(e, 'projects')}
            className="hover:underline py-2 sm:py-0 block px-4 sm:px-0"
          >
            Проекты
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            onClick={(e) => handleScroll(e, 'contact')}
            className="hover:underline py-2 sm:py-0 block px-4 sm:px-0"
          >
            Контакты
          </a>
        </li>
        {user ? (
          <li>
            <Link to="/profile" className="hover:underline py-2 sm:py-0 block px-4 sm:px-0">
              Профиль
            </Link>
          </li>
        ) : (
          <li>
            <a 
              href="#auth" 
              onClick={(e) => handleScroll(e, 'auth')}
              className="hover:underline py-2 sm:py-0 block px-4 sm:px-0"
            >
              Авторизация
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
