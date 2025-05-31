import React from "react";
import { m } from "framer-motion";
import { fadeInFromLeftVariant, zoomRotateVariant, useScrollAnimation } from "./config/animations";
import { useLanguage } from "./contexts/LanguageContext";
import { useTypewriter } from "./components/useTypewriter";

const About = () => {
  const { t, language } = useLanguage();
  const aboutText = t(language === 'ru' ? 'aboutText' : 'aboutTextEn');
  const typedText = useTypewriter(aboutText);

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
          {t("aboutTitle")}
        </m.h2>
        
        <m.div 
          className="space-y-6"
          variants={fadeInFromLeftVariant}
        >
          <m.p 
            className="text-xl leading-relaxed typewriter-effect minecraft-en-font"
          >
            {typedText.map((item, idx) => (
              <span key={idx} className={item.visible ? "typed" : "not-typed"}>{item.char}</span>
            ))}
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
          </m.div>
        </m.div>
      </div>
    </section>
  );
};

export default About;
