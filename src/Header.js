import React from "react";
import resume from "./data/hhResume.json";
import heroVideo from "./icons/anim_duck-v2.webm";
import heroStickerMobileWebp from "./icons/anim_duck-v2-mobile.webp";
import heroStickerMobilePng from "./icons/anim_duck-v2-mobile.png";

const Header = () => {
  return (
    <header id="header" className="snap-start min-h-screen pt-28 pb-16 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="max-w-xl">
            <span className="accent-pill">Junior Developer</span>
            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
              Я начинающий разработчик, который фокусируется на прикладной разработке,
              SQL и 1С:Предприятии. На этом сайте собраны мое резюме, учебные работы,
              pet-проекты и эксперименты с современными инструментами разработки. Через
              проекты показываю, как разбираюсь с бизнес-логикой, интерфейсами, хранением
              данных, backend-задачами и интеграциями. Отдельное внимание уделяю аккуратной
              подаче результата: понятной структуре, рабочим сценариям, адаптивной верстке
              и использованию AI-инструментов для анализа, поиска решений и ускорения рутины.
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
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-slate-500 text-sm">Желаемое направление</p>
                <p className="text-slate-900 text-xl mt-2">1С + SQL</p>
              </div>
              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 sm:col-span-2">
                <p className="text-sky-700 text-sm">Практика</p>
                <p className="text-slate-900 text-lg mt-2">Университетские задания, pet-проекты и работа с ИИ-инструментами</p>
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
