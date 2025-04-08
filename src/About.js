import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="snap-start min-h-screen flex flex-col items-center justify-center px-6 text-white bg-[#121212]"
    >
      <div className="max-w-3xl w-full mx-auto text-center">
        <h2 className="text-5xl font-bold mb-8 shimmer-text">Обо мне</h2>
        <div className="space-y-6">
          <p className="text-xl leading-relaxed">
            Изучаю Frontend разработку и верстаю сайты.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
