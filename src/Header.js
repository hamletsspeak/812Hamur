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

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Header = () => {
  return (
    <header id="header" className="snap-start min-h-[92vh] pt-28 pb-16 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="max-w-xl">
            <span className="accent-pill">Junior Developer</span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              hamletsspeak
            </h1>
            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
              Frontend-разработчик: React, React Native Expo, интерфейсы, API и
              практические pet-проекты. Здесь — резюме, кейсы и контакты.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="btn-primary font-semibold" onClick={() => scrollToId("projects")}>
                Смотреть проекты
              </button>
              <button type="button" className="btn-outline font-semibold" onClick={() => scrollToId("contact")}>
                Связаться
              </button>
            </div>
          </div>

          <div className="relative">
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
                    Мобильные приложения, учебные и pet-проекты
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

            <div className="mt-5 flex justify-center lg:absolute lg:-bottom-6 lg:right-4 lg:mt-0">
              <video
                className="hidden sm:block w-32 md:w-36 bg-transparent drop-shadow-sm"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={heroVideo} type="video/webm" />
              </video>
              <picture className="block sm:hidden w-32">
                <source srcSet={heroStickerMobileWebp} type="image/webp" />
                <img
                  src={heroStickerMobilePng}
                  alt="Стикер с уткой за ноутбуком"
                  className="w-full h-auto"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
