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
        {location.pathname === '/' && mainLinks.map(link => (
          <li key={link.id}>
            <a 
              href={`#${link.id}`}
              onClick={(e) => handleScroll(e, link.id)}
              className="hover:underline py-2 sm:py-0 block px-4 sm:px-0"
            >
              {link.text}
            </a>
          </li>
        ))}
        <li>
          <Link 
            to="/profile" 
            onClick={handleAuthClick}
            className="hover:underline py-2 sm:py-0 block px-4 sm:px-0"
          >
            {user ? 'Профиль' : 'Авторизация'}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
