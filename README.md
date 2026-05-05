# 812Hamur

React SPA с авторизацией и профилем на Supabase.

## Local run

```bash
npm ci
npm start
```

Создайте `.env` на основе `.env.example`.

## Supabase setup

1. Откройте SQL Editor в Supabase и выполните [`supabase/schema.sql`](supabase/schema.sql).
2. Включите GitHub OAuth в Supabase Auth (`Authentication -> Providers -> GitHub`).
3. Добавьте URL редиректа:
   - `http://localhost:3000/#/profile`
   - `https://<your-railway-domain>/#/profile`

## Railway deploy

Проект готов к деплою через `Dockerfile` + `railway.toml`.

1. Создайте сервис в Railway из этого репозитория.
2. Добавьте переменные окружения:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_GITHUB_TOKEN` (опционально)
3. Запустите Deploy.

Порт подхватывается автоматически через переменную `PORT`.
