import React from "react";
import { m } from "framer-motion";
import { fadeInFromLeftVariant, zoomRotateVariant, useScrollAnimation } from "./config/animations";

const About = () => {
  return (
    <section
      id="about"
      className="snap-start min-h-screen flex flex-col items-center justify-center px-6 text-white bg-[#121212] relative overflow-hidden"
    >
      <m.div
        className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      <div className="max-w-3xl w-full mx-auto text-center relative z-10">
        <m.h2 
          className="text-5xl sm:text-7xl font-bold mb-8 shimmer-text"
          variants={zoomRotateVariant}
          {...useScrollAnimation()}
        >
          Обо мне
        </m.h2>
        
        <m.div 
          className="space-y-6"
          variants={fadeInFromLeftVariant}
          {...useScrollAnimation(0.2)}
        >
          <m.p 
            className="text-xl leading-relaxed"
            whileHover={{ scale: 1.02 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            Изучаю Frontend разработку и верстаю сайты.
          </m.p>
          
          <m.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            {...useScrollAnimation(0.3)}
          >
            <m.div 
              className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Frontend</h3>
              <p className="text-gray-300">React, JavaScript, TypeScript, HTML5, CSS3</p>
            </m.div>
            
            <m.div 
              className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-400">UI/UX</h3>
              <p className="text-gray-300">Анимации, Адаптивный дизайн, Интерактивность</p>
            </m.div>
          </m.div>
        </m.div>
      </div>
    </section>
  );
};

export default About;
