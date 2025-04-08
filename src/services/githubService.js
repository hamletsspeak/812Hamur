import axios from 'axios';

const GITHUB_USERNAME = 'hamletsspeak';
const GITHUB_API_URL = 'https://api.github.com';

export const getRepositories = async () => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos`);
    return response.data
      .filter(repo => !repo.fork) // Исключаем форки
      .map(repo => ({
        name: repo.name,
        link: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: new Date(repo.updated_at)
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt); // Сортировка по дате обновления
  } catch (error) {
    console.error('Ошибка при получении репозиториев:', error);
    return [];
  }
};