import axios from 'axios';
import { askOpenRouter } from './openRouterService';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_OWNER = 'hamletsspeak';
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут
const MAX_README_LENGTH = 4000;

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

const decodeBase64 = (value) => {
  const binary = atob(value.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
};

const cleanGeneratedDescription = (value) =>
  value
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/\*\*/g, '')
    .replace(/^[-*]\s*/, '')
    .replace(/^Это(?=[А-Яа-яA-Za-z])/i, 'Это ')
    .replace(/^["'«]+|["'»]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getRepositoryReadme = async (repoName, headers) => {
  try {
    const { data } = await axios.get(`${GITHUB_API_URL}/repos/${GITHUB_OWNER}/${repoName}/readme`, {
      headers,
      timeout: 10000
    });

    if (!data?.content) return '';
    return decodeBase64(data.content).slice(0, MAX_README_LENGTH);
  } catch (error) {
    return '';
  }
};

const generateDescriptionFromGithub = async (repo, readme) => {
  const prompt = `
Сгенерируй короткое описание проекта для портфолио на русском языке.
Используй только данные GitHub ниже. Не придумывай факты, которых нет в данных.
Верни только готовое описание без заголовков, кавычек, markdown и списков.
Не начинай с "Это", "Данный проект", "Портфолио-проект" или названия репозитория.
Не перечисляй стек через запятую, если он явно не описан в README.
Стиль: естественно, просто, 1-2 предложения, до 180 символов.

Название репозитория: ${repo.name}
Язык: ${repo.language || 'не указан'}
Темы: ${repo.topics?.length ? repo.topics.join(', ') : 'не указаны'}
GitHub description: ${repo.description || 'отсутствует'}
README:
${readme || 'README отсутствует или недоступен'}
`.trim();

  const description = await askOpenRouter(prompt);
  return cleanGeneratedDescription(description);
};

const getFallbackDescription = (repo) => {
  const language = repo.language ? ` на ${repo.language}` : '';
  return `Учебный или pet-проект${language}, опубликованный на GitHub для практики и развития навыков.`;
};

const enrichRepository = async (repo, headers) => {
  if (repo.description) {
    return repo;
  }

  try {
    const readme = await getRepositoryReadme(repo.name, headers);
    const generatedDescription = await generateDescriptionFromGithub(repo, readme);

    return {
      ...repo,
      description: generatedDescription || getFallbackDescription(repo),
      descriptionSource: 'ai'
    };
  } catch (error) {
    console.warn(`Не удалось сгенерировать описание для ${repo.name}:`, error);
    return {
      ...repo,
      description: getFallbackDescription(repo),
      descriptionSource: 'fallback'
    };
  }
};

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

      const processedData = (await Promise.all(
        repositories.map((repo) => enrichRepository(repo, headers))
      )).sort((a, b) => b.updatedAt - a.updatedAt);

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
