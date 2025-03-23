import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from "framer-motion";

const projects = [
  {
    name: "Вёрстка сайта",
    description: "Проект с 2 курса — точная вёрстка по макету.",
    link: "https://github.com/hamletsspeak/hamletsspeak.github.io",
  },
  {
    name: "Веб-приложение",
    description: "Приложение на Ruby on Rails с REST API.",
    link: "https://github.com/hamletsspeak/Rails-App",
  },
  {
    name: "Сайт для магазина",
    description: "Сайт-визитка для автозапчастей с контактами.",
    link: "https://github.com/hamletsspeak/webparts",
  },
];

const Projects = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % projects.length);
    }, 10000); // 10 секунд
  
    return () => clearInterval(interval);
  }, []);
  
  const handleNext = () => {
    if (current < projects.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const project = projects[current];

  return (
    <section
      id="projects"
      className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6 text-center"
    >
      <h2 className="text-4xl font-bold mb-8 shimmer-text">Мои проекты</h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={project.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="bg-[#222] text-white rounded-lg shadow-lg p-6 w-full max-w-md border border-white/10"
        >
          <h3 className="text-2xl font-bold">{project.name}</h3>
          <p className="mt-2">{project.description}</p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 font-semibold inline-block mt-4 hover:underline"
          >
            Смотреть на GitHub →
          </a>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="bg-white text-blue-600 px-4 py-2 rounded disabled:opacity-30"
        >
          Назад
        </button>
        <span className="text-lg">
          {current + 1} / {projects.length}
        </span>
        <button
          onClick={handleNext}
          disabled={current === projects.length - 1}
          className="bg-white text-blue-600 px-4 py-2 rounded disabled:opacity-30"
        >
          Вперёд
        </button>
      </div>
    </section>
  );
};

export default Projects;
