import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { useLanguage } from "./contexts/LanguageContext";
import resumePhoto from "./icons/кот.jpg";

const NavLink = ({ to, onClick, children }) => (
  <li>
    {to.startsWith('#') ? (
      <a
        href={to}
        onClick={onClick}
        className="text-slate-600 hover:text-sky-600 transition-colors duration-200 px-2 py-1"
      >
        {children}
      </a>
    ) : (
      <Link
        to={to}
        onClick={onClick}
        className="text-slate-600 hover:text-sky-600 transition-colors duration-200 px-2 py-1"
      >
        {children}
      </Link>
    )}
  </li>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

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

  const mainLinks = [
    { id: 'about', text: t('aboutTitle') },
    { id: 'projects', text: t('projectsTitle') },
    { id: 'contact', text: t('contactsTitle') }
  ];

  return (
    <>
      <m.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-8 py-4 bg-white/55 backdrop-blur-2xl [backdrop-filter:saturate(180%)_blur(20px)] border-b border-white/60 shadow-[0_8px_30px_rgba(15,23,42,0.08)] navbar-font ${typeof window !== 'undefined' && window.innerWidth <= 640 ? 'mobile-navbar-transparent' : ''}`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src={resumePhoto}
              alt="Фото профиля"
              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
            />
            <span className="text-slate-900 font-bold tracking-wide text-base sm:text-lg truncate">hamletsspeak</span>
          </button>

          <ul className="hidden sm:flex items-center gap-5">
            {mainLinks.map((link) => (
              <NavLink key={link.id} to={`#${link.id}`} onClick={(e) => handleScroll(e, link.id)}>
                {link.text}
              </NavLink>
            ))}
          </ul>

          <div className="hidden sm:flex items-center gap-3">
            <button className="btn-primary font-semibold" onClick={() => window.open('game/index.html', '_blank')}>
              {t('openGame')}
            </button>
          </div>

          <button className="sm:hidden text-slate-700" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </m.nav>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="sm:hidden fixed top-20 left-4 right-4 z-40 rounded-2xl glass-card p-5"
          >
            <ul className="space-y-3">
              {mainLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} onClick={(e) => handleScroll(e, link.id)} className="block text-slate-700 py-2">
                    {link.text}
                  </a>
                </li>
              ))}
              <li><button onClick={() => window.open('game/index.html', '_blank')} className="btn-primary w-full">{t('openGame')}</button></li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
