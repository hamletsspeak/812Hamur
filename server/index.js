const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const ASSISTANT_SYSTEM_PROMPT = `
Ты ассистент персонального сайта-визитки Hamlet Urushadze (hamletsspeak).
Отвечай только по темам, связанным с владельцем сайта и его контентом:
- навыки, опыт, проекты, резюме, стек, контакты;
- навигация по этому сайту и пояснение разделов.
Не придумывай факты. Если данных на сайте недостаточно, так и скажи и предложи связаться через контакты.
Если вопрос не связан с владельцем сайта или содержимым сайта, вежливо откажись и верни разговор к темам сайта.
Отвечай кратко, по делу, на русском языке.
Если не хватает данных или тема не относится к сайту, используй только этот шаблон:
"Я отвечаю только по информации этого сайта о Гамлете Урушадзе. Уточните вопрос по разделам: опыт, навыки, проекты, резюме, контакты."
`.trim();
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-3-4b-it:free';
const OPENROUTER_MODELS = (process.env.OPENROUTER_MODELS || 'google/gemma-3-4b-it:free,meta-llama/llama-3.2-3b-instruct:free,qwen/qwen3-30b-a3b:free,openrouter/free')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);
const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 90000);
const OPENROUTER_RETRIES = Number(process.env.OPENROUTER_RETRIES || 2);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalizeFreeModel = (model) => {
  if (!model) return 'openrouter/free';
  if (model === 'openrouter/free' || model.endsWith(':free')) return model;
  return 'openrouter/free';
};
const normalizeFreeModels = (models) =>
  models
    .map((model) => normalizeFreeModel(model))
    .filter((model, index, arr) => arr.indexOf(model) === index);
const buildModelChain = () => {
  const primary = normalizeFreeModel(OPENROUTER_MODEL);
  const fallback = normalizeFreeModels(OPENROUTER_MODELS).filter((model) => model !== primary);
  return [primary, ...fallback];
};

app.use(express.json({ limit: '1mb' }));

app.post('/api/ai', async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server key OPENROUTER_API_KEY is missing' });
    }

    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const modelChain = buildModelChain();

    let lastStatus = 500;
    let lastError = 'OpenRouter request failed';

    for (let attempt = 0; attempt <= OPENROUTER_RETRIES; attempt += 1) {
      const modelForAttempt = modelChain[attempt % modelChain.length];
      const payload = {
        model: modelForAttempt,
        temperature: 0.2,
        max_tokens: 180,
        messages: [
          { role: 'system', content: ASSISTANT_SYSTEM_PROMPT },
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

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content || 'Нет ответа от модели.';
          clearTimeout(timeoutId);
          return res.json({ response: content, model: data?.model || modelForAttempt });
        }

        const text = await response.text();
        lastStatus = response.status;
        lastError = text || 'OpenRouter request failed';
        clearTimeout(timeoutId);

        if (![502, 503, 504].includes(response.status) || attempt === OPENROUTER_RETRIES) {
          return res.status(response.status).json({ error: lastError });
        }
      } catch (error) {
        clearTimeout(timeoutId);
        lastStatus = 504;
        lastError = error?.name === 'AbortError'
          ? `OpenRouter timeout after ${OPENROUTER_TIMEOUT_MS}ms`
          : (error.message || 'OpenRouter network error');

        if (attempt === OPENROUTER_RETRIES) {
          return res.status(lastStatus).json({ error: lastError });
        }
      }

      await sleep(700 * (attempt + 1));
    }

    return res.status(lastStatus).json({ error: lastError, note: 'All free model attempts failed' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/{*any}', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
