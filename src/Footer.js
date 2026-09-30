import React from "react";
import resume from "./data/hhResume.json";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const github = resume?.contacts?.github || "https://github.com/hamletsspeak";
  const telegram = resume?.contacts?.telegram
    ? `https://t.me/${resume.contacts.telegram.replace("@", "")}`
    : "https://t.me/hamletsspeak";

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="px-5 pb-10">
      <div className="max-w-6xl mx-auto glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-slate-900 font-bold text-lg">hamletsspeak</p>
            <p className="text-slate-500 text-sm mt-1">
              &copy; {currentYear}. Frontend portfolio &amp; pet-проекты.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <button type="button" onClick={() => scrollToId("about")} className="text-slate-600 hover:text-sky-600 transition-colors">
              Обо мне
            </button>
            <button type="button" onClick={() => scrollToId("projects")} className="text-slate-600 hover:text-sky-600 transition-colors">
              Проекты
            </button>
            <button type="button" onClick={() => scrollToId("contact")} className="text-slate-600 hover:text-sky-600 transition-colors">
              Контакты
            </button>
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-sky-600 transition-colors">
              GitHub
            </a>
            <a href={telegram} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-sky-600 transition-colors">
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
