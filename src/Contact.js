import React, { memo } from "react";
import { m } from "framer-motion";
import OptimizedImage from "./components/OptimizedImage";
import yandexIconPath from "./icons/yandex-icon.svg";
import phoneIconPath from "./icons/phone-icon.svg";
import telegramIconPath from "./icons/telegram-icon.png";
import resume from "./data/hhResume.json";

const SpoilerContactCard = memo(({ icon, alt, label, value, hint }) => (
  <m.div
    className="glass-card rounded-2xl p-5 flex items-center justify-between gap-4"
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className="flex items-center gap-4 min-w-0">
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-2 shrink-0">
        <OptimizedImage src={icon} alt={alt} width={40} height={40} className="w-full h-full object-contain" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <span className="text-slate-700 font-medium break-all">
          <spoiler-span reveal-duration="350" density="10" particle-lifetime="140">
            {value}
          </spoiler-span>
        </span>
      </div>
    </div>
    <p className="hidden md:block text-xs text-slate-500 text-right max-w-[240px] leading-5">
      <spoiler-span reveal-duration="350" density="10" particle-lifetime="140">
        {hint}
      </spoiler-span>
    </p>
  </m.div>
));

const Contact = memo(() => {
  return (
    <section id="contact" className="snap-start min-h-screen px-5 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title text-slate-900 font-bold">Мои контакты</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 max-w-3xl">
          <SpoilerContactCard
            icon={yandexIconPath}
            alt="Yandex Mail"
            label="Email"
            value={resume?.contacts?.email || "Не указано"}
            hint="Возможно сразу замечу и отвечу"
          />
          <SpoilerContactCard
            icon={phoneIconPath}
            alt="Phone"
            label="Телефон"
            value={resume?.contacts?.phone || "Не указано"}
            hint="возможно подумаю что вы мошенник, звоните 2 раза"
          />
          <SpoilerContactCard
            icon={telegramIconPath}
            alt="Telegram"
            label="Telegram"
            value={resume?.contacts?.telegram || "Не указано"}
            hint="замечу сразу и отвечу быстро"
          />
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';
export default Contact;
