import React from "react";
import resume from "./data/hhResume.json";
import heroVideo from "./icons/anim_duck.webm";

const Header = () => {
  return (
    <header id="header" className="snap-start min-h-screen pt-28 pb-16 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="max-w-xl">
            <span className="accent-pill">Junior Developer</span>
            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
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
                <p className="text-slate-900 text-xl mt-2">
                  {resume.area ? (
                    <spoiler-span reveal-duration="250">{resume.area}</spoiler-span>
                  ) : (
                    "Город не указан"
                  )}
                </p>
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
        <div className="mt-6 flex justify-center">
          <video
            className="w-36 sm:w-40 md:w-44"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={heroVideo} type="video/webm" />
          </video>
        </div>
      </div>
    </header>
  );
};

export default Header;
