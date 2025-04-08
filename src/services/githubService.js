import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';
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

export const getRepositories = async () => {
  try {
    // Проверяем наличие кэшированных данных
    const cachedData = cache.get('repositories');
    if (cachedData) {
      console.log('Используются кэшированные данные');
      return cachedData;
    }

    console.log('Начинаем загрузку репозиториев...');
    
    // Пробуем получить данные без авторизации
    const response = await axios.get(`${GITHUB_API_URL}/users/hamletsspeak/repos`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      timeout: 10000 // 10 секунд таймаут
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      const processedData = response.data
        .filter(repo => !repo.fork && !repo.private)
        .map(repo => ({
          name: repo.name,
          link: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language,
          updatedAt: new Date(repo.updated_at),
          description: repo.description || 'Нет описания'
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