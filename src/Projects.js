import React, { useState, useEffect, memo } from 'react';
import { m } from './config/animations';
import { getRepositories } from './services/githubService';

const ProjectCard = memo(({ project, onViewGithub }) => (
  <m.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-[#222] text-white rounded-lg shadow-lg p-6 w-full max-w-md border border-white/10"
  >
    <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
    <p className="mt-2 text-gray-300">{project.description}</p>
    {project.language && (
      <p className="mt-2 text-blue-400">Технология: {project.language}</p>
    )}
    {project.stars > 0 && (
      <p className="mt-2 text-yellow-400">⭐ {project.stars}</p>
    )}
    <button
      onClick={() => onViewGithub(project.link)}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      Смотреть на GitHub
    </button>
  </m.div>
));

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const [current, setCurrent] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout;

    const fetchProjects = async () => {
      if (!navigator.onLine) {
        setError('Отсутствует подключение к интернету. Проверьте сетевое подключение.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const repos = await getRepositories();
        
        if (!isMounted) return;

        if (repos && repos.length > 0) {
          setProjects(repos);
          setLoading(false);
          setRetryCount(0);
        } else {
          if (retryCount < 2) {
            console.log('Повторная попытка загрузки...');
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(fetchProjects, 3000);
          } else {
            setError('Не удалось загрузить проекты. Возможно, они временно недоступны.');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке проектов:', err);
        if (!isMounted) return;
        
        setError(err.message || 'Произошла неизвестная ошибка при загрузке проектов');
        setLoading(false);
      }
    };

    window.addEventListener('online', fetchProjects);
    window.addEventListener('offline', () => {
      setError('Отсутствует подключение к интернету');
      setLoading(false);
    });

    fetchProjects();

    return () => {
      isMounted = false;
      window.removeEventListener('online', fetchProjects);
      window.removeEventListener('offline', () => {});
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryCount]);

  const handleViewGithub = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % projects.length);
  };

  const handleRetry = () => {
    if (!navigator.onLine) {
      setError('Проверьте подключение к интернету и попробуйте снова');
      return;
    }
    setRetryCount(0);
    setLoading(true);
  };

  if (loading) {
    return (
      <section id="projects" className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-8 text-center shimmer-text">Мои проекты</h2>
        <div className="space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-32 bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="h-10 w-20 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <p className="text-center text-gray-400">
            {retryCount > 0 ? `Повторная попытка ${retryCount}/2...` : 'Загрузка проектов...'}
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-8 shimmer-text">Мои проекты</h2>
        <div className="text-center">
          <div className="text-red-400 mb-4 max-w-md">{error}</div>
          <button
            onClick={handleRetry}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        <h2 className="text-4xl font-bold mb-8 text-center shimmer-text">
          Мои проекты
        </h2>
        
        <div className="flex flex-col items-center">
          {projects.length > 0 ? (
            <>
              <ProjectCard
                project={projects[current]}
                onViewGithub={handleViewGithub}
              />
              
              <div className="flex items-center gap-6 mt-8">
                <button
                  onClick={handlePrev}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  ←
                </button>
                <span className="text-lg">
                  {current + 1} / {projects.length}
                </span>
                <button
                  onClick={handleNext}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  →
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-4">Проекты не найдены</p>
              <button
                onClick={handleRetry}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Обновить
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(Projects);
