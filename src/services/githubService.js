import axios from 'axios';

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

  clear() {
    this.data.clear();
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

const buildDefaultDescription = (repo) => {
  const language = repo.language ? ` на ${repo.language}` : '';
  return `Проект${language} из GitHub-портфолио с открытым исходным кодом и практической разработкой.`;
};

const getProjectDescription = (repo) =>
  PROJECT_DESCRIPTIONS[repo.name] || repo.description || buildDefaultDescription(repo);

export const getRepositories = async () => {
  try {
    const cachedData = cache.get('repositories');
    if (cachedData) {
      console.log('Используются кэшированные данные');
      return cachedData;
    }

    console.log('Начинаем загрузку репозиториев...');
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };

    // Добавляем токен только если он существует
    if (process.env.REACT_APP_GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.REACT_APP_GITHUB_TOKEN}`;
    }

    const response = await axios.get(`${GITHUB_API_URL}/users/${GITHUB_OWNER}/repos`, {
      headers,
      timeout: 10000 // 10 секунд таймаут
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      const repositories = response.data
        .filter(repo => !repo.fork && !repo.private)
        .map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          link: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language,
          topics: repo.topics || [],
          updatedAt: new Date(repo.updated_at)
        }));

      const processedData = repositories
        .map((repo) => ({
          ...repo,
          description: getProjectDescription(repo)
        }))
        .sort((a, b) => b.updatedAt - a.updatedAt);

      if (processedData.length > 0) {
        console.log('Обработано репозиториев:', processedData.length);
        cache.set('repositories', processedData);
        return processedData;
      }
    }
    
    throw new Error('Не удалось получить данные о репозиториях');
  } catch (error) {
    console.error('Ошибка при получении репозиториев:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Превышено время ожидания запроса. Проверьте подключение к интернету.');
    }
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 403) {
        throw new Error('Превышен лимит запросов к GitHub API. Пожалуйста, подождите несколько минут.');
      }
      
      if (status === 404) {
        throw new Error('Пользователь не найден или репозитории недоступны.');
      }
      
      throw new Error(`Ошибка GitHub API: ${data.message || 'Неизвестная ошибка'}`);
    }
    
    throw new Error('Не удалось подключиться к GitHub. Проверьте подключение к интернету.');
  }
};
