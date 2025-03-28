import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="snap-start min-h-screen flex flex-col items-center justify-center px-6 text-white text-center bg-[#121212]"
    >
      <div className="max-w-xl">
        <h2 className="text-4xl font-bold mb-4 shimmer-text">Обо мне</h2>
        <p className="text-lg">Изучаю Frontend разработку и верстаю сайты.</p>
      </div>
    </section>
  );
};

export default About;
