import React, { memo, useEffect, useMemo, useState } from "react";
import { getRepositories } from "../services/githubService";
import resume from "../data/hhResume.json";

const SKILL_GROUPS = [
  {
    key: "frontend",
    title: "Frontend",
    skills: ["Frontend", "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    key: "backend",
    title: "Backend",
    skills: ["Backend", "Node.js", "Express", "Python", "Go", "Ruby", "API"],
  },
  {
    key: "database",
    title: "Database",
    skills: ["SQL", "PostgreSQL", "ER-моделирование"],
  },
  {
    key: "system",
    title: "Системный анализ",
    skills: ["Системный анализ", "BPMN", "Проектирование ИС"],
  },
  {
    key: "tools",
    title: "Tools",
    skills: ["Git", "Docker", "Supabase", "Nginx", "Redis", "RabbitMQ"],
  },
  {
    key: "ai",
    title: "AI",
    skills: ["AI", "OpenRouter", "Prompting"],
  },
];

const normalize = (value) => (value || "").toString().toLowerCase();

const projectMatchesSkill = (project, skill) => {
  const target = normalize(skill);
  const content = [
    project.name,
    project.description,
    project.role,
    project.language,
    ...(project.directions || []),
    ...(project.stack || []),
  ]
    .map(normalize)
    .join(" ");

  if (target === "api") return /\bapi\b/.test(content);
  if (target === "ai") return /\bai\b|\bllm\b|\bml\b|openrouter/.test(content);
  return content.includes(target);
};

const SkillsMap = () => {
  const [projects, setProjects] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("SQL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const list = await getRepositories();
        if (mounted) setProjects(list || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const knownSkills = useMemo(() => new Set((resume.skills || []).map((skill) => skill.toLowerCase())), []);

  const filteredGroups = useMemo(
    () =>
      SKILL_GROUPS.map((group) => ({
        ...group,
        skills: group.skills.filter(
          (skill) =>
            knownSkills.has(skill.toLowerCase()) ||
            projects.some((project) => projectMatchesSkill(project, skill))
        ),
      })).filter((group) => group.skills.length > 0),
    [knownSkills, projects]
  );

  const relatedProjects = useMemo(
    () => projects.filter((project) => projectMatchesSkill(project, selectedSkill)),
    [projects, selectedSkill]
  );

  return (
    <section id="skills-map" className="snap-start min-h-screen px-5 py-24">
      <div className="max-w-6xl mx-auto">
        <span className="accent-pill">Skill Map</span>
        <h2 className="section-title mt-4 text-slate-900 font-bold text-3xl sm:text-5xl leading-tight">
          Интерактивная карта навыков
        </h2>
        <p className="mt-4 text-slate-600 max-w-3xl">
          Кликните по навыку, чтобы увидеть связанные проекты. Фокус профиля: SQL + системный анализ.
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="glass-card rounded-3xl p-5 sm:p-6">
            <h3 className="text-xl font-bold text-slate-900">Навыки по группам</h3>
            <div className="mt-4 space-y-4">
              {filteredGroups.map((group) => (
                <div key={group.key}>
                  <p className="text-sm uppercase tracking-wide text-slate-500">{group.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.skills.map((skill) => {
                      const active = selectedSkill === skill;
                      return (
                        <button
                          key={`${group.key}-${skill}`}
                          onClick={() => setSelectedSkill(skill)}
                          className={active ? "btn-primary text-sm" : "btn-outline text-sm"}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 sm:p-6">
            <h3 className="text-xl font-bold text-slate-900">Связанные проекты: {selectedSkill}</h3>
            {loading && <p className="mt-4 text-slate-600">Загрузка проектов...</p>}
            {!loading && relatedProjects.length === 0 && (
              <p className="mt-4 text-slate-600">Для выбранного навыка пока нет связанных проектов.</p>
            )}
            {!loading && relatedProjects.length > 0 && (
              <div className="mt-4 space-y-3">
                {relatedProjects.map((project) => (
                  <div key={project.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="font-semibold text-slate-900">{project.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(project.directions || []).map((direction) => (
                        <span
                          key={`${project.id}-${direction}`}
                          className="rounded-full bg-sky-50 text-sky-700 px-2.5 py-1 text-xs font-semibold"
                        >
                          {direction}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(SkillsMap);

