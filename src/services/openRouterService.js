import axios from 'axios';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const askOpenRouter = async (message, history = []) => {
  try {
    const { data } = await axios.post('/api/ai', { message, history }, { timeout: 100000 });
    return data?.response || 'Нет ответа от модели.';
  } catch (error) {
    if (error?.response?.status === 504) {
      await sleep(700);
      const { data } = await axios.post('/api/ai', { message, history }, { timeout: 100000 });
      return data?.response || 'Нет ответа от модели.';
    }
    throw error;
  }
};
