import React from "react";
import telegramIcon from "./icons/telegram-icon.png";
import gmailIcon from "./icons/gmail-icon.png";

const Contact = () => {
  return (
    <section
      id="contact"
      className="snap-start min-h-screen bg-[#121212] flex flex-col items-center justify-center px-6 text-white text-center"
    >
      <h2 className="text-4xl font-bold mb-6">Контакты</h2>

      <div className="flex gap-6">
        <a
          href="mailto:gamleturusadze@gmail.com"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={gmailIcon}
            alt="Gmail"
            className="w-12 h-12 hover:scale-110 transition"
          />
        </a>
        <a href="https://t.me/hamletsspeak" target="_blank" rel="noreferrer">
          <img
            src={telegramIcon}
            alt="Telegram"
            className="w-12 h-12 hover:scale-110 transition"
          />
        </a>
      </div>
    </section>
  );
};

export default Contact;
