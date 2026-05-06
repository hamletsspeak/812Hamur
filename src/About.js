import React from "react";
import { m } from "framer-motion";
import { fadeInFromLeftVariant, useScrollAnimation } from "./config/animations";
import { useLanguage } from "./contexts/LanguageContext";
import resume from "./data/hhResume.json";
import resumePhoto from "./icons/кот.jpg";

const About = () => {
  const { t } = useLanguage();
  const hiddenCompanies = new Set(["ООО «Альберт Кутуков Бизнес»", "Т-Банк"]);

  return (
    <section id="about" className="snap-start min-h-screen px-5 py-24">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <span className="accent-pill">Резюме</span>
          <h2 className="section-title mt-4 font-bold text-slate-900">{t("aboutTitle")}</h2>
          <p className="text-slate-600 mt-4">Данные извлекаются из PDF-резюме перед запуском/сборкой.</p>
        </div>

        <m.div
          className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8"
          variants={fadeInFromLeftVariant}
          {...useScrollAnimation()}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src={resumePhoto}
                alt="Фото для резюме"
                className="h-20 w-20 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {resume.fullName ? (
                    <spoiler-span reveal-duration="250">{resume.fullName}</spoiler-span>
                  ) : (
                    "Не указано"
                  )}
                </h3>
                <p className="text-sky-700 mt-1 font-semibold">{resume.title || "Название резюме не указано"}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-slate-500 text-sm">Город</p>
                <p className="text-slate-900 mt-1">
                  {resume.area ? (
                    <spoiler-span reveal-duration="250">{resume.area}</spoiler-span>
                  ) : (
                    "Не указано"
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-slate-500 text-sm">Зарплатные ожидания</p>
                <p className="text-slate-900 mt-1">
                  {resume.salary ? (
                    <spoiler-span reveal-duration="250">{resume.salary}</spoiler-span>
                  ) : (
                    "Не указано"
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-slate-500 text-sm">Обновлено</p>
                <p className="text-slate-900 mt-1">{resume.parsedAt ? new Date(resume.parsedAt).toLocaleDateString("ru-RU") : "Не указано"}</p>
              </div>
            </div>

            {resume.contacts && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-slate-500 text-sm">Телефон</p>
                  <p className="text-slate-900 mt-1">
                    {resume.contacts.phone ? (
                      <spoiler-span reveal-duration="250">{resume.contacts.phone}</spoiler-span>
                    ) : (
                      "Не указано"
                    )}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-slate-500 text-sm">Email</p>
                  <p className="text-slate-900 mt-1">
                    {resume.contacts.email ? (
                      <spoiler-span reveal-duration="250">{resume.contacts.email}</spoiler-span>
                    ) : (
                      "Не указано"
                    )}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Ключевые навыки</h4>
              <div className="flex flex-wrap gap-2">
                {(resume.skills?.length ? resume.skills : ["Навыки не найдены"]).map((skill) => (
                  <span key={skill} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Последний опыт</h4>
              <div className="space-y-3">
                {(resume.experience?.length ? resume.experience : [{ company: "Нет данных", role: "", period: "", description: "" }]).map((job, idx) => (
                  <div key={`${job.company}-${idx}`} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="font-semibold text-slate-900">
                      {hiddenCompanies.has(job.company) ? (
                        <spoiler-span reveal-duration="250">{job.company}</spoiler-span>
                      ) : (
                        job.company
                      )}
                    </p>
                    <p className="text-sky-700 text-sm mt-1">{job.role}</p>
                    <p className="text-slate-500 text-sm mt-1">{job.period}</p>
                    {job.description && <p className="text-slate-600 mt-2 text-sm">{job.description}</p>}
                  </div>
                ))}
              </div>
            </div>

            {resume.warning && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-700 text-sm">
                {resume.warning}
              </div>
            )}
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default About;
