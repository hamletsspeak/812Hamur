import React, { memo, useMemo, useState } from 'react';
import resume from '../data/hhResume.json';
import { DEEP_DIVE_PROJECTS } from '../data/projectsData';

const PROJECT_NAMES = DEEP_DIVE_PROJECTS.map((project) => ({
  name: project.title,
  directions: project.directions || [],
  link: `https://github.com/hamletsspeak/${project.repoName}`
}));

const ResumeTerminal = () => {
  const hhResumeUrl = resume.hhResumeUrl || '';
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'Resume Terminal ready. Type `help` to list commands.' }
  ]);

  const commandMap = useMemo(() => {
    const skills = resume.skills?.length ? resume.skills.join(', ') : 'Навыки не указаны';
    const projectsList = PROJECT_NAMES.map((project, index) => `${index + 1}. ${project.name}`).join('\n');
    return {
      help: [
        'Доступные команды:',
        '- whoami',
        '- skills',
        '- all projects',
        '- contact',
        '- resume',
        '- clear'
      ].join('\n'),
      whoami: 'Гамлет Урушадзе, junior/fullstack developer с фокусом на frontend, backend и SQL-практику.',
      skills,
      'all projects': projectsList,
      contact: [
        `Email: ${resume?.contacts?.email || 'не указан'}`,
        `Телефон: ${resume?.contacts?.phone || 'не указан'}`,
        `Telegram: ${resume?.contacts?.telegram || 'не указан'}`
      ].join('\n')
    };
  }, []);

  const runCommand = (rawValue) => {
    const command = rawValue.trim();
    if (!command) return;

    setHistory((prev) => [...prev, { type: 'input', text: command }]);

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    if (command === 'resume') {
      if (!hhResumeUrl) {
        setHistory((prev) => [...prev, { type: 'output', text: 'Ссылка на HH-резюме не настроена.' }]);
        return;
      }

      window.open(hhResumeUrl, '_blank', 'noopener,noreferrer');
      setHistory((prev) => [...prev, { type: 'output', text: `Открываю HH-резюме: ${hhResumeUrl}` }]);
      return;
    }

    const output = commandMap[command] || `Команда не найдена: ${command}. Введите help.`;
    setHistory((prev) => [...prev, { type: 'output', text: output }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runCommand(input);
    setInput('');
  };

  return (
    <section id="resume-terminal" className="snap-start min-h-screen px-5 py-24">
      <div className="max-w-6xl mx-auto">
        <span className="accent-pill">Terminal</span>
        <h2 className="section-title mt-4 text-slate-900 font-bold text-3xl sm:text-5xl leading-tight">Терминал-резюме</h2>

        <div className="glass-card rounded-3xl mt-8 p-4 sm:p-6 border border-slate-200">
          <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 sm:p-5 min-h-[340px] font-mono text-sm leading-6">
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {history.map((entry, index) => (
                <pre key={`${entry.type}-${index}`} className="whitespace-pre-wrap break-words m-0">
                  {entry.type === 'input' ? `hamlet@resume:~$ ${entry.text}` : entry.text}
                </pre>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
              <label htmlFor="terminal-input" className="sr-only">Команда</label>
              <div className="text-emerald-300 shrink-0">hamlet@resume:~$</div>
              <input
                id="terminal-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="w-full bg-transparent border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                placeholder="Введите команду..."
                autoComplete="off"
              />
            </form>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['help', 'whoami', 'skills', 'all projects', 'contact', 'resume'].map((cmd) => (
              <button key={cmd} onClick={() => runCommand(cmd)} className="btn-outline text-sm">
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ResumeTerminal);
