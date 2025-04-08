import React from 'react';
import { m } from './config/animations';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-t from-[#1a1a1a] to-[#121212] text-white py-8">
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 text-center"
      >
        <p className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
          &copy; {currentYear} hamletsspeak. Все права защищены.
        </p>
      </m.div>
    </footer>
  );
};

export default Footer;
