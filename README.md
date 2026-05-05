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

## Vercel deploy via GitHub

1. Запушьте проект в GitHub-репозиторий.
2. В Vercel нажмите `Add New -> Project` и импортируйте этот репозиторий.
3. В `Environment Variables` добавьте:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_GITHUB_TOKEN` (опционально, если хотите увеличить лимиты GitHub API)
4. Нажмите `Deploy`.

Проект собирается командой `npm run build`, а артефакты берутся из папки `build` (настроено в `vercel.json`).

После первого деплоя добавьте Vercel-домен в Supabase Auth `Redirect URLs`:
- `https://<your-vercel-domain>/#/profile`
