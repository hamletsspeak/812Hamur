import React, { useState, useEffect, memo } from 'react';
import { m, AnimatePresence } from './config/animations';
import { fadeInFromRightVariant, useScrollAnimation } from './config/animations';
import { getRepositories } from './services/githubService';
import { useLanguage } from './contexts/LanguageContext';
import { PROJECT_DIRECTIONS } from './data/projectsData';

const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-sm sm:text-base text-slate-700 mt-1 leading-6">{value}</p>
  </div>
);

const ProjectCard = memo(({ project, isExpanded, onToggleDetails, onViewGithub }) => {
  const isSasagramProject = /сасаграм|sasagram/i.test(project?.name || '');

  return (
    <m.div
      variants={fadeInFromRightVariant}
      {...useScrollAnimation(0.2)}
      className="glass-card rounded-3xl p-5 sm:p-8 w-full self-start h-fit"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">{project.name}</h3>
        {project.stars > 0 && <span className="accent-pill">{project.stars} stars</span>}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(project.directions || []).map((direction) => (
          <span key={`${project.id}-${direction}`} className="rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs font-semibold">
            {direction}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-slate-600 leading-6 sm:leading-7 text-sm sm:text-base">{project.description || 'Описание отсутствует'}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DetailRow label="Роль" value={project.role} />
          <DetailRow label="Сложность" value={project.complexity} />
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <m.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-5 border-t border-slate-200 pt-5 space-y-4">
                <DetailRow label="Проблема" value={project.problem} />
                <DetailRow label="Решение" value={project.solution} />
                <DetailRow label="Результат" value={project.result} />
                <DetailRow label="Чему научился" value={project.learned} />
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Стек</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(project.stack || []).map((item) => (
                      <span key={`${project.id}-${item}`} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-3 flex-wrap">
        <button onClick={() => onToggleDetails(project.id)} className="btn-outline font-semibold">
          {isExpanded ? 'Скрыть детали' : 'Подробнее'}
        </button>
        <button onClick={() => onViewGithub(project.link)} className="btn-primary font-semibold">
          Смотреть на GitHub
        </button>
        {isSasagramProject && (
          <button onClick={() => window.open('https://sasavot141.ru', '_blank', 'noopener,noreferrer')} className="btn-outline font-semibold">
            Посмотреть сайт
          </button>
        )}
      </div>
    </m.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [activeDirection, setActiveDirection] = useState(PROJECT_DIRECTIONS[0]);
  const [expandedProjectIds, setExpandedProjectIds] = useState(() => new Set());
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

  const filteredProjects = projects.filter((project) => {
    if (activeDirection === 'Все') return true;
    return (project.directions || []).includes(activeDirection);
  });

  const leftColumnProjects = filteredProjects.filter((_, index) => index % 2 === 0);
  const rightColumnProjects = filteredProjects.filter((_, index) => index % 2 === 1);

  const handleToggleDetails = (projectId) => {
    setExpandedProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  return (
    <section id="projects" className="snap-start min-h-screen px-5 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="accent-pill">Portfolio</span>
            <h2 className="section-title mt-4 text-slate-900 font-bold text-3xl sm:text-5xl leading-tight">{t('projectsTitle')}</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 py-2 text-sm sm:text-base text-slate-600">
            {filteredProjects.length} проектов
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {PROJECT_DIRECTIONS.map((direction) => (
            <button
              key={direction}
              className={activeDirection === direction ? 'btn-primary text-sm' : 'btn-outline text-sm'}
              onClick={() => setActiveDirection(direction)}
            >
              {direction}
            </button>
          ))}
        </div>

        {loading && <div className="glass-card rounded-3xl p-8 text-slate-600">{t('loadingProjects')}</div>}

        {!loading && error && (
          <div className="glass-card rounded-3xl p-8 border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && filteredProjects.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start lg:hidden">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isExpanded={expandedProjectIds.has(project.id)}
                  onToggleDetails={handleToggleDetails}
                  onViewGithub={handleViewGithub}
                />
              ))}
            </div>

            <div className="hidden lg:grid lg:grid-cols-2 gap-5 items-start">
              <div className="space-y-5">
                {leftColumnProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isExpanded={expandedProjectIds.has(project.id)}
                    onToggleDetails={handleToggleDetails}
                    onViewGithub={handleViewGithub}
                  />
                ))}
              </div>
              <div className="space-y-5">
                {rightColumnProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isExpanded={expandedProjectIds.has(project.id)}
                    onToggleDetails={handleToggleDetails}
                    onViewGithub={handleViewGithub}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="glass-card rounded-3xl p-8 text-slate-600">
            Для этого направления пока нет проектов.
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(Projects);

