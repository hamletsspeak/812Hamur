# 812Hamur

Персональный сайт-портфолио Hamlet Urushadze. Проект показывает резюме, список GitHub-проектов, контакты, AI-ассистента и встроенную WebGL-игру March3.

## Что есть в проекте

- React SPA на Create React App и HashRouter.
- Главная страница с резюме, проектами, контактами и медиа-блоками.
- Загрузка публичных репозиториев GitHub с заранее подготовленными описаниями проектов.
- Supabase Auth, профиль пользователя и хранение пользовательских данных.
- AI-ассистент через serverless endpoint `/api/ai` и OpenRouter.
- Встроенная Unity/WebGL-игра в маршруте `#/webgl-game`.
- Адаптивная верстка на Tailwind CSS и анимации через Framer Motion.
- Production-сборка для Vercel и Express-сервер для self-hosted запуска.

## Стек

- React 19
- React Router
- Tailwind CSS
- Framer Motion
- Supabase
- Axios
- Express
- OpenRouter API
- Unity WebGL build

## Локальный запуск

```bash
npm ci
npm start
```

Приложение откроется на `http://localhost:3000`.

Для запуска React-приложения вместе с локальным API-сервером:

```bash
npm run dev
```

Локальный API-сервер будет работать на `http://localhost:8787`, а CRA proxy направит запросы `/api/*` на него.

## Переменные окружения

Создайте файл `.env` в корне проекта.

```env
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_PUBLISHABLE_KEY=...
REACT_APP_GITHUB_TOKEN=...
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=google/gemma-3-4b-it:free
OPENROUTER_MODELS=google/gemma-3-4b-it:free,meta-llama/llama-3.2-3b-instruct:free,qwen/qwen3-30b-a3b:free,openrouter/free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_NAME=812Hamur
```

`REACT_APP_GITHUB_TOKEN` опционален. Он нужен только для увеличения лимитов GitHub API.

`OPENROUTER_API_KEY` нужен для AI-ассистента. Раздел проектов не использует OpenRouter при загрузке.

## Supabase

1. Создайте проект в Supabase.
2. Выполните SQL из `supabase/schema.sql` в Supabase SQL Editor.
3. Включите GitHub OAuth в `Authentication -> Providers`.
4. Добавьте redirect URL:

```text
http://localhost:3000/#/profile
https://<your-domain>/#/profile
```

## Скрипты

```bash
npm start
```

Запускает React dev server.

```bash
npm run server:dev
```

Запускает Express API server на порту `8787`.

```bash
npm run dev
```

Запускает frontend и backend одновременно.

```bash
npm run build
```

Создает production-сборку в папке `build`.

```bash
npm run server
```

Запускает Express-сервер, который отдает `build` и обрабатывает `/api/ai`.

## Деплой на Vercel

1. Импортируйте репозиторий в Vercel.
2. Укажите переменные окружения из раздела выше.
3. Оставьте build command `npm run build`.
4. Output directory: `build`.
5. После первого деплоя добавьте Vercel-домен в Supabase Auth Redirect URLs.

Serverless endpoint для AI находится в `api/ai.js`, настройки деплоя описаны в `vercel.json`.

## Проекты на сайте

Раздел проектов получает публичные репозитории GitHub пользователя `hamletsspeak`, но описания не генерируются во время загрузки страницы. Тексты описаний находятся в `src/services/githubService.js` в словаре `PROJECT_DESCRIPTIONS`.

Это делает загрузку быстрее и убирает зависимость раздела проектов от AI-модели.
