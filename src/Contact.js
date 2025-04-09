import React, { memo } from 'react';
import { m } from "framer-motion";
import OptimizedImage from './components/OptimizedImage';
import gmailIconPath from './icons/gmail-icon.png';
import telegramIconPath from './icons/telegram-icon.png';
import {zoomRotateVariant, useScrollAnimation } from './config/animations';

const ContactLink = memo(({ href, icon, alt, text }) => (
  <m.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-4 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-6 rounded-xl w-full max-w-md border border-white/10 hover:border-blue-500/50 transition-all duration-300 shadow-lg relative overflow-hidden"
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 0.8
    }}
  >
    <m.div
      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      initial={{ scale: 0 }}
      whileHover={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    />
    <m.div 
      className="w-10 h-10 flex-shrink-0 bg-white/5 rounded-lg p-2 relative z-10"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <OptimizedImage
        src={icon}
        alt={alt}
        width={40}
        height={40}
        className="w-full h-full object-contain"
      />
    </m.div>
    <m.span 
      className="text-lg font-medium text-gray-200 group-hover:text-blue-400 transition-colors duration-300 relative z-10"
      whileHover={{ x: 5 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {text}
    </m.span>
  </m.a>
));

const Contact = memo(() => {
  return (
    <section
      id="contact"
      className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-8"
    >
      <div className="w-full max-w-4xl mx-auto text-center">
        <m.h2 
          className="text-5xl sm:text-7xl font-bold mb-12 shimmer-text"
          variants={zoomRotateVariant}
          {...useScrollAnimation()}
        >
          Контакты
        </m.h2>
        <m.p 
          className="text-xl text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
        >
          Свяжитесь со мной удобным для вас способом
        </m.p>
        <div className="flex flex-col gap-6 items-center">
          <ContactLink
            href="mailto:gamleturusadze@gmail.com"
            icon={gmailIconPath}
            alt="Gmail"
            text="gamleturusadze@gmail.com"
          />
          <ContactLink
            href="https://t.me/hamletsspeak"
            icon={telegramIconPath}
            alt="Telegram"
            text="@hamletsspeak"
          />
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';
export default Contact;
