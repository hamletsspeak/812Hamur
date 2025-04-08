import React from "react";
import { useAuth } from "./contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header id="header" className="snap-start min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white text-center px-4">
      <h1 className="text-5xl sm:text-6xl font-bold font-rus3d shimmer-text">
        {user ? "Привет! Я Гамлет" : "Добро пожаловать!"}
      </h1>
      <p className="text-2xl mt-4 md:text-3xl">
        {user ? "Студент 4 курса КубГУ" : "Пожалуйста, войдите в систему чтобы увидеть мои проекты"}
      </p>
    </header>
  );
};

export default Header;
