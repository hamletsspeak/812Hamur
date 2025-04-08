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
    className="flex items-center gap-4 hover:scale-105 transition-transform bg-[#1f1f1f] p-4 rounded-lg w-full max-w-md"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="w-8 h-8 flex-shrink-0">
      <OptimizedImage
        src={icon}
        alt={alt}
        width={32}
        height={32}
        className="w-full h-full object-contain"
      />
    </div>
    <span className="text-lg">{text}</span>
  </m.a>
));

const Contact = memo(() => {
  return (
    <section
      id="contact"
      className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6"
    >
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center w-full"
      >
        <h2 className="text-4xl font-bold mb-8 shimmer-text">Контакты</h2>
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
