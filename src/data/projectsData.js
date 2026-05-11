export const PROJECT_DIRECTIONS = [
  'Все',
  'SQL',
  'Системный анализ',
  'Frontend',
  'Backend',
  'AI',
  'Учебные проекты'
];

export const DEEP_DIVE_PROJECTS = [
  {
    id: '812hamur',
    repoName: '812Hamur',
    title: '812Hamur - сайт-резюме',
    directions: ['Frontend', 'Backend', 'AI'],
    role: 'Fullstack developer',
    complexity: 'Средняя',
    stack: ['Frontend', 'TailwindCSS', 'Node.js', 'Express', 'Supabase'],
    problem: 'Нужно было сделать резюме, которое показывает не только навыки, но и инженерный подход через интерактив и реальные интеграции.',
    solution: 'Собрал SPA с разделами резюме, GitHub-интеграцией, AI-ассистентом и серверной частью для API-запросов и хранения пользовательских данных.',
    result: 'Получилась платформа, где работодатель видит проекты, стек и подход к продуктовой разработке в одном месте.',
    learned: 'Укрепил практику построения сквозной архитектуры frontend + backend и работы с UX-сценариями портфолио.',
    featured: true
  },
  {
    id: 'sasagram',
    repoName: 'sasagram',
    title: 'Sasagram',
    directions: ['Frontend', 'Backend'],
    role: 'Frontend/Backend developer',
    complexity: 'Средняя+',
    stack: ['Next.js', 'TypeScript', 'Node.js', 'REST API'],
    problem: 'Требовался сайт-визитка стримера с живым контентом, ссылками на площадки и удобной навигацией для аудитории.',
    solution: 'Реализовал модульный Next.js-проект с блоками расписания, медиаконтента и агрегированными статусами площадок.',
    result: 'Проект стал основной цифровой витриной и упростил доступ аудитории к контенту и активностям.',
    learned: 'Прокачал проектирование контентных интерфейсов и организацию фич в масштабируемой структуре Next.js.',
    featured: true
  },
  {
    id: 'hamotraining',
    repoName: 'HamoTraining',
    title: 'HamoTraining',
    directions: ['Frontend', 'SQL', 'Backend'],
    role: 'Product developer',
    complexity: 'Средняя',
    stack: ['Frontend', 'Node.js', 'PostgreSQL', 'Chart.js'],
    problem: 'Нужно было хранить и анализировать данные по тренировкам, воде и добавкам без ручных таблиц.',
    solution: 'Сделал систему учёта с журналами, агрегированными метриками и визуализацией прогресса по периодам.',
    result: 'Пользователь получает прозрачную картину динамики и может корректировать тренировочный режим на данных.',
    learned: 'Усилил навыки работы с прикладной аналитикой и моделированием пользовательских данных в SQL.',
    featured: true
  },
  {
    id: 'stris-labs',
    repoName: 'stris-labs',
    title: 'Stris Labs',
    directions: ['Backend', 'Учебные проекты'],
    role: 'Backend engineer (labs)',
    complexity: 'Высокая',
    stack: ['Docker', 'Nginx', 'Redis', 'PostgreSQL', 'RabbitMQ'],
    problem: 'Требовалось на практике отработать инфраструктурные и backend-паттерны: proxy, кэш, репликация, очереди.',
    solution: 'Поднял лабораторный набор сервисов и последовательно реализовал сценарии API, балансировки и обработки сообщений.',
    result: 'Сформировал рабочий учебный стенд для демонстрации системного мышления и базовой production-логики.',
    learned: 'Укрепил понимание эксплуатационных рисков и компромиссов архитектуры распределённых систем.',
    featured: true
  },
  {
    id: 'infosystemsdesign',
    repoName: 'InfoSystemsDesign',
    title: 'InfoSystemsDesign',
    directions: ['SQL', 'Системный анализ', 'Учебные проекты'],
    role: 'System analyst / developer',
    complexity: 'Средняя+',
    stack: ['SQL', 'ER-моделирование', 'BPMN', 'Проектирование ИС'],
    problem: 'Нужно было спроектировать информационную систему ломбарда с корректной моделью данных и бизнес-процессов.',
    solution: 'Описал предметную область, построил связи сущностей, определил ограничения и сценарии операций.',
    result: 'Собрана проектная база, пригодная для дальнейшей реализации в web-стеке с SQL-бэкендом.',
    learned: 'Углубил навыки системного анализа и трансляции бизнес-логики в структуру данных.',
    featured: true
  }
];




