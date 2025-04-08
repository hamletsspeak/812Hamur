import React, { useState, useEffect, memo } from 'react';
import { m, AnimatePresence } from './config/animations';
import { getRepositories } from './services/githubService';

const ProjectCard = memo(({ project, onViewGithub, direction }) => (
  <m.div
    initial={{ 
      opacity: 0,
      y: direction === 'right' ? 20 : -20,
      scale: 0.95
    }}
    animate={{ 
      opacity: 1,
      y: 0,
      scale: 1
    }}
    exit={{ 
      opacity: 0,
      y: direction === 'right' ? -20 : 20,
      scale: 0.95
    }}
    transition={{ 
      type: "spring",
      stiffness: 300,
      damping: 30
    }}
    className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-white rounded-xl shadow-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md mx-auto border border-white/10 hover:border-blue-500/50 transition-all duration-300"
  >
    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-blue-400">{project.name}</h3>
    <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">{project.description}</p>
    {project.language && (
      <p className="mt-2 sm:mt-4 text-sm sm:text-base text-blue-400 font-medium">Технология: {project.language}</p>
    )}
    {project.stars > 0 && (
      <p className="mt-2 text-sm sm:text-base text-yellow-400 font-medium">⭐ {project.stars}</p>
    )}
    <button
      onClick={() => onViewGithub(project.link)}
      className="mt-4 sm:mt-6 bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 font-medium"
    >
      Смотреть на GitHub
    </button>
  </m.div>
));

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('right');
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
    setDirection('left');
    setCurrent(prev => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setDirection('right');
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
      <section id="projects" className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-12 shimmer-text">Мои проекты</h2>
          <div className="space-y-6 w-full max-w-md mx-auto">
            <div className="h-8 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex justify-center gap-6 mt-8">
              <div className="h-12 w-24 bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-12 w-24 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            <p className="text-center text-gray-400 mt-6">
              {retryCount > 0 ? `Повторная попытка ${retryCount}/2...` : 'Загрузка проектов...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-12 shimmer-text">Мои проекты</h2>
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-400 mb-6">{error}</div>
            <button
              onClick={handleRetry}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 font-medium"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="snap-start min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl mx-auto text-center px-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 shimmer-text">
          Мои проекты
        </h2>
        
        <div className="flex flex-col items-center">
          {projects.length > 0 ? (
            <>
              <div className="relative w-full min-h-[300px] sm:min-h-[350px] flex items-center justify-center mb-4 sm:mb-6">
                <AnimatePresence mode="wait" initial={false}>
                  <ProjectCard
                    key={current}
                    project={projects[current]}
                    onViewGithub={handleViewGithub}
                    direction={direction}
                  />
                </AnimatePresence>
              </div>
              
              <div className="flex items-center justify-center gap-4 sm:gap-6 w-full mt-2 sm:mt-4">
                <m.button
                  onClick={handlePrev}
                  className="bg-blue-500/80 backdrop-blur-sm text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-blue-600 transition-all duration-300 flex items-center justify-center text-base sm:text-lg relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <m.div
                    className="absolute inset-0 rounded-full bg-blue-400/20 group-hover:scale-110 transition-transform duration-300"
                  />
                  <m.span
                    className="relative"
                    whileHover={{ x: -4 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                  >
                    ←
                  </m.span>
                </m.button>
                
                <m.div 
                  key={current}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-blue-500/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/90"
                >
                  <span className="text-base sm:text-lg font-medium">
                    {current + 1} / {projects.length}
                  </span>
                </m.div>

                <m.button
                  onClick={handleNext}
                  className="bg-blue-500/80 backdrop-blur-sm text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-blue-600 transition-all duration-300 flex items-center justify-center text-base sm:text-lg relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <m.div
                    className="absolute inset-0 rounded-full bg-blue-400/20 group-hover:scale-110 transition-transform duration-300"
                  />
                  <m.span
                    className="relative"
                    whileHover={{ x: 4 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                  >
                    →
                  </m.span>
                </m.button>
              </div>
            </>
          ) : (
            <div className="bg-[#2a2a2a] rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-400 mb-6 text-lg">Проекты не найдены</p>
              <button
                onClick={handleRetry}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 font-medium"
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
