import React, { useMemo } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import resume from "./data/hhResume.json";

const Header = () => {
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
          <span className="accent-pill">Junior Developer</span>
          <h1 className="section-title font-bold mt-5 hero-gradient-text">
            {displayText}
            <span className="text-orange-500">|</span>
          </h1>
          <p className="text-slate-600 mt-6 text-lg leading-relaxed max-w-xl">
            Я начинающий разработчик. Хочу расти в направлении 1С:Предприятия и SQL:
            разбираться в бизнес-логике, базах данных и прикладной разработке.
            Проекты на сайте показывают мой учебный опыт и то, что я делаю для практики
            в свободное время. В работе активно использую ИИ, чтобы быстрее находить решения
            и доводить результат до аккуратного, современного уровня.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-slate-500 text-sm">Город</p>
              <p className="text-slate-900 text-xl mt-2">{resume.area || "Город не указан"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-slate-500 text-sm">Желаемое направление</p>
              <p className="text-slate-900 text-xl mt-2">1С + SQL</p>
            </div>
            <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 col-span-2">
              <p className="text-sky-700 text-sm">Практика</p>
              <p className="text-slate-900 text-lg mt-2">Университетские задания, pet-проекты и работа с ИИ-инструментами</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
