const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const normalizeFreeModel = (model) => {
  if (!model) return 'openrouter/free';
  if (model === 'openrouter/free' || model.endsWith(':free')) return model;
  return 'openrouter/free';
};

const normalizeFreeModels = (models) =>
  models
    .map((model) => normalizeFreeModel(model))
    .filter((model, index, arr) => arr.indexOf(model) === index);

const buildModelChain = (primaryModel, fallbackModelsRaw) => {
  const primary = normalizeFreeModel(primaryModel);
  const fallback = normalizeFreeModels(fallbackModelsRaw).filter((model) => model !== primary);
  return [primary, ...fallback];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server key OPENROUTER_API_KEY is missing' });
      return;
    }

    const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';
    const OPENROUTER_MODELS = (process.env.OPENROUTER_MODELS || 'openrouter/free,meta-llama/llama-3.2-3b-instruct:free,google/gemma-3-4b-it:free,qwen/qwen3-30b-a3b:free')
      .split(',')
      .map((model) => model.trim())
      .filter(Boolean);
    const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 90000);
    const OPENROUTER_RETRIES = Number(process.env.OPENROUTER_RETRIES || 4);
    const modelChain = buildModelChain(OPENROUTER_MODEL, OPENROUTER_MODELS);

    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    let lastStatus = 500;
    let lastError = 'OpenRouter request failed';

    for (let attempt = 0; attempt <= OPENROUTER_RETRIES; attempt += 1) {
      const modelForAttempt = modelChain[attempt % modelChain.length];
      const payload = {
        model: modelForAttempt,
        messages: [
          { role: 'system', content: 'Ты полезный и краткий AI-ассистент сайта.' },
          ...history,
          { role: 'user', content: message }
        ]
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
            'X-OpenRouter-Title': process.env.OPENROUTER_APP_NAME || '812Hamur',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content || 'Нет ответа от модели.';
          res.status(200).json({ response: content, model: data?.model || modelForAttempt });
          return;
        }

        const text = await response.text();
        lastStatus = response.status;
        lastError = text || 'OpenRouter request failed';

        if (![502, 503, 504].includes(response.status) || attempt === OPENROUTER_RETRIES) {
          res.status(response.status).json({ error: lastError });
          return;
        }
      } catch (error) {
        clearTimeout(timeoutId);
        lastStatus = 504;
        lastError = error?.name === 'AbortError'
          ? `OpenRouter timeout after ${OPENROUTER_TIMEOUT_MS}ms`
          : (error.message || 'OpenRouter network error');

        if (attempt === OPENROUTER_RETRIES) {
          res.status(lastStatus).json({ error: lastError });
          return;
        }
      }

      await sleep(700 * (attempt + 1));
    }

    res.status(lastStatus).json({ error: lastError, note: 'All free model attempts failed' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
