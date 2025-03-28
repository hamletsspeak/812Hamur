import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1f1f1f] flex justify-between items-center px-4 py-2 z-50">
      <div className="text-white text-2xl font-semibold">Гамлет</div>

      {/* Гамбургер меню */}
      <div className="sm:hidden" onClick={toggleMenu}>
        <div className="space-y-2">
          <span className="block w-8 h-0.5 bg-white"></span>
          <span className="block w-8 h-0.5 bg-white"></span>
          <span className="block w-8 h-0.5 bg-white"></span>
        </div>
      </div>

      {/* Меню для мобильных */}
      <ul
        className={`${
          menuOpen ? "block" : "hidden"
        } sm:flex gap-8 text-white absolute sm:static top-16 left-0 w-full sm:w-auto bg-[#1f1f1f] sm:bg-transparent py-2`}
      >
        <li>
          <a href="#about" className="hover:underline py-2 sm:py-0">
            Обо мне
          </a>
        </li>
        <li>
          <a href="#projects" className="hover:underline py-2 sm:py-0">
            Проекты
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:underline py-2 sm:py-0">
            Контакты
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
