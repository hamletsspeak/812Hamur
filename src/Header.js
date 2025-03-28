import React from "react";

const Header = () => {
  return (
    <header className="snap-start min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white text-center px-4">
      <h1 className="text-5xl sm:text-6xl font-bold font-rus3d shimmer-text">
        Привет! Я Гамлет
      </h1>
      <p className="text-2xl mt-4 md:text-3xl">Студент 4 курса КубГУ</p>
    </header>
  );
};

export default Header;
