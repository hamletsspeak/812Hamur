import React, { useState, useEffect, memo } from 'react';
import { m, AnimatePresence } from './config/animations';
import { fadeInFromRightVariant, useScrollAnimation } from './config/animations';
import { getRepositories } from './services/githubService';
import { useLanguage } from "./contexts/LanguageContext";

const ProjectCard = memo(({ project, onViewGithub }) => {
  return (
    <m.div
      variants={fadeInFromRightVariant}
      {...useScrollAnimation(0.2)}
      className="glass-card rounded-3xl p-6 sm:p-8 w-full"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-bold text-slate-900">{project.name}</h3>
        {project.stars > 0 && (
          <span className="accent-pill">{project.stars} stars</span>
        )}
      </div>
      <p className="mt-4 text-slate-600 leading-7">{project.description || 'Описание отсутствует'}</p>
      {project.language && (
        <p className="mt-3 text-sm text-sky-700 font-semibold">{project.language}</p>
      )}
      <button onClick={() => onViewGithub(project.link)} className="btn-primary mt-6 font-semibold">
        Смотреть на GitHub
      </button>
    </m.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const repos = await getRepositories();
        if (!isMounted) return;
        setProjects(repos || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Ошибка загрузки проектов');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewGithub = (link) => window.open(link, '_blank', 'noopener,noreferrer');

  return (
    <section id="projects" className="snap-start min-h-screen px-5 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="accent-pill">Portfolio</span>
            <h2 className="section-title mt-4 text-slate-900 font-bold">{t("projectsTitle")}</h2>
          </div>
          {projects.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-600">
              {current + 1} / {projects.length}
            </div>
          )}
        </div>

        {loading && <div className="glass-card rounded-3xl p-8 text-slate-600">{t("loadingProjects")}</div>}

        {!loading && error && (
          <div className="glass-card rounded-3xl p-8 border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              <ProjectCard key={projects[current].id || current} project={projects[current]} onViewGithub={handleViewGithub} />
            </AnimatePresence>
            <div className="mt-6 flex gap-3">
              <button className="btn-outline" onClick={() => setCurrent((p) => (p - 1 + projects.length) % projects.length)}>Назад</button>
              <button className="btn-primary" onClick={() => setCurrent((p) => (p + 1) % projects.length)}>Вперёд</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default memo(Projects);
