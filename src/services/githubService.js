import axios from 'axios';
import { DEEP_DIVE_PROJECTS } from '../data/projectsData';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_OWNER = 'hamletsspeak';
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

class Cache {
  constructor() {
    this.data = new Map();
  }

  set(key, value) {
    this.data.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.data.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > CACHE_DURATION;
    if (isExpired) {
      this.data.delete(key);
      return null;
    }

    return item.value;
  }
}

const cache = new Cache();

const PROJECT_DESCRIPTIONS = {
  '812Hamur': 'Персональный сайт-портфолио на React с резюме, GitHub-проектами, контактами, AI-ассистентом и встроенной WebGL-игрой March3. Проект объединяет витрину опыта, интерактивные разделы и практику работы с frontend, API и пользовательскими сценариями.',
  'stris-labs': 'Набор лабораторных работ по современным технологиям разработки информационных систем: REST API, reverse proxy, балансировка, кэширование, транзакции, репликация и брокеры сообщений.',
  'sasagram': 'Next.js-сайт-визитка стримера SASAVOT с расписанием, Twitch-клипами, записями стримов, агрегированными статусами площадок и анонимной системой рейтинга.',
  'HamoTraining': 'Приложение для учёта тренировок, воды и добавок: помогает отслеживать прогресс, хранить упражнения и получать аналитические инсайты по занятиям.',
  'InfoSystemsDesign': 'Учебный проект по проектированию информационных систем на примере ломбарда: модели клиентов, залогов, финансовых операций и базы данных.',
  'Frontend-labs': 'Коллекция фронтенд-лабораторных и ранняя версия персонального сайта на HTML, CSS и JavaScript, размещаемого через GitHub Pages.',
  'testovoe_saper': 'Браузерная реализация классического “Сапёра” на HTML, CSS и JavaScript с открытием соседних клеток, доработанной логикой ходов и финальным UI.',
  'magazin': 'Next.js-проект интернет-магазина, построенный на App Router и TypeScript как основа для витрины, страниц товаров и дальнейшей e-commerce-логики.',
  'SecurityHam': 'Лабораторные работы по криптографии на Python: реализации шифра Цезаря, AES, RSA и сопутствующие задания по шифрованию и дешифрованию текста.',
  'Go-labs': 'Учебный репозиторий на Go с лабораторными работами по синтаксису, структуре проектов, сетевым сервисам, конкурентности и базовым backend-подходам.',
  'Rails-App': 'Прототип социальной сети в стиле Instagram на Ruby on Rails с регистрацией, профилями, публикациями, загрузкой изображений и административными возможностями.',
  'krd-practice': 'Практические задания летней Ruby-практики: серия уроков с упражнениями, скриптами и закреплением базовых возможностей языка.',
  'university-labworks-python': 'Университетские лабораторные работы по Python: практические задания, домашние работы и примеры по основным темам курса.'
};

const PROJECT_DIRECTION_OVERRIDES = {
  'frontend-labs': ['Frontend', 'Учебные проекты']
};

const buildDefaultDescription = (repo) => {
  const language = repo.language ? ` на ${repo.language}` : '';
  return `Проект${language} из GitHub-портфолио с открытым исходным кодом и практической разработкой.`;
};

const getProjectDescription = (repo) =>
  PROJECT_DESCRIPTIONS[repo.name] || repo.description || buildDefaultDescription(repo);

const toRepoModel = (repo) => ({
  id: repo.id,
  name: repo.name,
  description: getProjectDescription(repo),
  link: repo.html_url,
  stars: repo.stargazers_count,
  language: repo.language,
  topics: repo.topics || [],
  updatedAt: new Date(repo.updated_at)
});

const inferDirections = (repo) => {
  const override = PROJECT_DIRECTION_OVERRIDES[repo.name.toLowerCase()];
  if (override) return override;

  const source = `${repo.name} ${repo.description} ${repo.language} ${(repo.topics || []).join(' ')}`.toLowerCase();
  const directions = [];

  if (/react|next|frontend|html|css/.test(source)) directions.push('Frontend');
  if (/sql|postgres|database|db/.test(source)) directions.push('SQL');
  if (/erp|process|bpmn|system design|analyst/.test(source)) directions.push('Системный анализ');
  if (/api|node|express|go|rails|backend|server|docker|redis|rabbit|nginx/.test(source)) directions.push('Backend');
  if (/\b(ai|ml|llm|openrouter|gpt)\b/.test(source)) directions.push('AI');
  if (directions.length === 0) directions.push('Учебные проекты');

  return directions;
};

const mergeDeepDiveData = (repositories) => {
  const byName = new Map(repositories.map((repo) => [repo.name.toLowerCase(), repo]));

  const deepDive = DEEP_DIVE_PROJECTS.map((project, index) => {
    const githubRepo = byName.get(project.repoName.toLowerCase());

    return {
      ...project,
      id: project.id || githubRepo?.id || `${project.repoName}-${index}`,
      name: project.title,
      description: githubRepo?.description || project.solution,
      link: githubRepo?.link || `https://github.com/${GITHUB_OWNER}/${project.repoName}`,
      stars: githubRepo?.stars || 0,
      language: githubRepo?.language || project.stack[0],
      updatedAt: githubRepo?.updatedAt || null
    };
  });

  const deepDiveNames = new Set(DEEP_DIVE_PROJECTS.map((item) => item.repoName.toLowerCase()));
  const regularProjects = repositories
    .filter((repo) => !deepDiveNames.has(repo.name.toLowerCase()))
    .map((repo) => ({
      ...repo,
      directions: inferDirections(repo),
      role: 'Разработчик',
      complexity: 'Средняя',
      problem: 'Практическая задача из портфолио/обучения.',
      solution: 'Реализация в рамках репозитория с фокусом на рабочий результат.',
      result: 'Рабочий проект в GitHub-портфолио.',
      learned: 'Усиление практики разработки и проектирования.',
      stack: [repo.language || 'General']
    }));

  return [...deepDive, ...regularProjects];
};

export const getRepositories = async () => {
  try {
    const cachedData = cache.get('repositories');
    if (cachedData) return cachedData;

    const headers = {
      Accept: 'application/vnd.github.v3+json'
    };

    if (process.env.REACT_APP_GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.REACT_APP_GITHUB_TOKEN}`;
    }

    const response = await axios.get(`${GITHUB_API_URL}/users/${GITHUB_OWNER}/repos`, {
      headers,
      timeout: 10000
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      const repositories = response.data
        .filter((repo) => !repo.fork && !repo.private)
        .map(toRepoModel)
        .sort((a, b) => b.updatedAt - a.updatedAt);

      const merged = mergeDeepDiveData(repositories);
      cache.set('repositories', merged);
      return merged;
    }

    throw new Error('Не удалось получить данные о репозиториях');
  } catch {
    const fallback = mergeDeepDiveData([]);
    cache.set('repositories', fallback);
    return fallback;
  }
};
