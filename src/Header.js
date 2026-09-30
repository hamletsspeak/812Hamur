import React from "react";
import resume from "./data/hhResume.json";
import heroVideo from "./icons/anim_duck-v2.webm";
import heroStickerMobileWebp from "./icons/anim_duck-v2-mobile.webp";
import heroStickerMobilePng from "./icons/anim_duck-v2-mobile.png";

const workedWith = [
  "React",
  "React Native",
  "TypeScript",
  "JavaScript",
  "Expo",
  "SQL",
  "HTML",
  "CSS",
  "Git",
];

const Header = () => {
  return (
    <header id="header" className="snap-start min-h-screen pt-28 pb-16 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="max-w-xl">
            <span className="accent-pill">Junior Developer</span>
            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
              Я начинающий frontend-разработчик: пишу интерфейсы на React и React Native Expo,
              связываю их с API и храню данные пользователя. На сайте собраны резюме, учебные
              работы, pet-проекты и эксперименты со стеком, с которым уже работал на практике.
              Стремлюсь к понятной структуре, рабочим сценариям, аккуратной верстке и
              использованию AI-инструментов для анализа задач и ускорения рутины.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4">
                <p className="text-sky-700 text-sm">Практика</p>
                <p className="text-slate-900 text-base mt-2">
                  Мобильные приложения, university projects и работа с ИИ
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:col-span-2">
                <p className="text-slate-500 text-sm">С чем я работал</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {workedWith.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <video
            className="hidden sm:block w-36 sm:w-40 md:w-44 bg-transparent"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={heroVideo} type="video/webm" />
          </video>
          <picture className="block sm:hidden w-36">
            <source srcSet={heroStickerMobileWebp} type="image/webp" />
            <img
              src={heroStickerMobilePng}
              alt="Стикер с уткой за ноутбуком"
              className="w-full h-auto"
            />
          </picture>
        </div>
      </div>
    </header>
  );
};

export default Header;
