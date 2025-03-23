import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1f1f1f]/80 backdrop-blur-md shadow-md z-50">
      <ul className="flex justify-center gap-8 py-3 text-white font-semibold">
        <li>
          <a href="#about" className="hover:underline">
            Обо мне
          </a>
        </li>
        <li>
          <a href="#projects" className="hover:underline">
            Проекты
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:underline">
            Контакты
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
