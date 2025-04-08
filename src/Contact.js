import React, { memo } from 'react';
import { m } from "framer-motion";
import OptimizedImage from './components/OptimizedImage';
import gmailIconPath from './icons/gmail-icon.png';
import telegramIconPath from './icons/telegram-icon.png';

const ContactLink = memo(({ href, icon, alt, text }) => (
  <m.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-6 rounded-xl w-full max-w-md border border-white/10 hover:border-blue-500/50 transition-all duration-300 shadow-lg"
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="w-10 h-10 flex-shrink-0 bg-white/5 rounded-lg p-2 transition-transform duration-300 group-hover:scale-110">
      <OptimizedImage
        src={icon}
        alt={alt}
        width={40}
        height={40}
        className="w-full h-full object-contain"
      />
    </div>
    <span className="text-lg font-medium text-gray-200 hover:text-blue-400 transition-colors duration-300">{text}</span>
  </m.a>
));

const Contact = memo(() => {
  return (
    <section
      id="contact"
      className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-8"
    >
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="w-full max-w-4xl mx-auto text-center"
      >
        <h2 className="text-5xl font-bold mb-12 shimmer-text">Контакты</h2>
        <p className="text-xl text-gray-400 mb-8">Свяжитесь со мной удобным для вас способом</p>
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
      </m.div>
    </section>
  );
});

Contact.displayName = 'Contact';
export default Contact;
