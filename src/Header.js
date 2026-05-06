import React, { useMemo } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useLanguage } from "./contexts/LanguageContext";

const Header = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const greetings = useMemo(() => [
    t("helloWorld"),
    "BONJOUR LE MONDE!",
    "¡HOLA MUNDO!",
    "HALLO WELT!",
    "CIAO MONDO!"
  ], [t]);

  const displayText = greetings[0];

  return (
    <header id="header" className="snap-start min-h-screen pt-28 pb-16 px-5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="accent-pill">Frontend Developer</span>
          <h1 className="section-title font-bold mt-5 hero-gradient-text">
            {displayText}
            <span className="text-orange-500">|</span>
          </h1>
          <p className="text-slate-600 mt-6 text-lg leading-relaxed max-w-xl">
            Создаю быстрые, выразительные и удобные интерфейсы. Этот сайт теперь полностью в новом визуальном стиле: светлый, структурный и живой.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={user ? "#projects" : "#projects"} className="btn-primary font-semibold">{t("projectsTitle")}</a>
            <a href="#contact" className="btn-outline font-semibold">{t("contactsTitle")}</a>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-slate-500 text-sm">Stack</p>
              <p className="text-slate-900 text-xl mt-2">React / JS / Supabase</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-slate-500 text-sm">Focus</p>
              <p className="text-slate-900 text-xl mt-2">UX + Performance</p>
            </div>
            <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 col-span-2">
              <p className="text-sky-700 text-sm">Сейчас в работе</p>
              <p className="text-slate-900 text-lg mt-2">Редизайн, анимации, GitHub/Supabase интеграции</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
