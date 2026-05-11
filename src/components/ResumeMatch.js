import React, { memo, useState } from "react";
import axios from "axios";

const ALLOWED_EXTENSIONS = [".txt", ".md", ".csv", ".json", ".log", ".rtf", ".pdf", ".docx"];

const isAllowedFile = (file) => {
  const name = file?.name?.toLowerCase() || "";
  const type = file?.type?.toLowerCase() || "";
  return type.startsWith("text/") || ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
};

const isPlainTextFile = (file) => {
  const name = file?.name?.toLowerCase() || "";
  const type = file?.type?.toLowerCase() || "";
  const textExt = [".txt", ".md", ".csv", ".json", ".log", ".rtf"];
  return type.startsWith("text/") || textExt.some((ext) => name.endsWith(ext));
};

const ResumeMatch = () => {
  const [vacancyUrl, setVacancyUrl] = useState("");
  const [vacancyText, setVacancyText] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [error, setError] = useState("");

  const handleExtractFromUrl = async () => {
    if (!vacancyUrl.trim()) {
      setError("Вставьте ссылку на вакансию.");
      return;
    }

    setLoadingUrl(true);
    setError("");

    try {
      let data;
      try {
        const primary = await axios.post("/api/vacancy", { url: vacancyUrl.trim() }, { timeout: 30000 });
        data = primary.data;
      } catch (primaryError) {
        if (primaryError?.response?.status !== 404) throw primaryError;
        const fallback = await axios.post("/api/vacancy/extract", { url: vacancyUrl.trim() }, { timeout: 30000 });
        data = fallback.data;
      }
      setVacancyText(data?.text || "");
      setSourceLabel(data?.sourceUrl || vacancyUrl.trim());
    } catch (requestError) {
      const message = requestError?.response?.data?.error || "Не удалось загрузить текст вакансии по ссылке.";
      setError(message);
    } finally {
      setLoadingUrl(false);
    }
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
      reader.readAsDataURL(file);
    });

  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
      reader.readAsText(file);
    });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    if (!isAllowedFile(file)) {
      setError("Поддерживаемые форматы: .txt, .md, .csv, .json, .log, .rtf, .pdf, .docx");
      return;
    }

    try {
      if (isPlainTextFile(file)) {
        const text = await readFileAsText(file);
        setVacancyText(text.slice(0, 120000));
        setSourceLabel(file.name);
        return;
      }

      const dataUrl = await readFileAsDataUrl(file);
      let response;
      try {
        response = await axios.post(
          "/api/vacancy/file-extract",
          { fileName: file.name, mimeType: file.type, base64: dataUrl },
          { timeout: 45000 }
        );
      } catch (primaryError) {
        if (primaryError?.response?.status !== 404) throw primaryError;
        response = await axios.post(
          "/api/vacancy-file",
          { fileName: file.name, mimeType: file.type, base64: dataUrl },
          { timeout: 45000 }
        );
      }

      setVacancyText((response.data?.text || "").slice(0, 120000));
      setSourceLabel(response.data?.sourceFile || file.name);
    } catch (fileError) {
      const status = fileError?.response?.status;
      const message =
        status === 404
          ? "API для обработки PDF/DOCX недоступен. Запустите проект командой `npm run dev`."
          : fileError?.response?.data?.error || fileError?.message || "Не удалось обработать файл.";
      setError(message);
    }
  };

  return (
    <section id="resume-match" className="snap-start min-h-screen px-5 py-24">
      <div className="max-w-6xl mx-auto">
        <span className="accent-pill">Resume Match</span>
        <h2 className="section-title mt-4 text-slate-900 font-bold text-3xl sm:text-5xl leading-tight">
          Анализ вакансии
        </h2>
        <p className="mt-4 text-slate-600 max-w-3xl">
          Добавьте ссылку на вакансию или загрузите файл с описанием, чтобы заполнить текст для анализа.
        </p>

        <div className="glass-card rounded-3xl mt-8 p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Ссылка на вакансию</label>
              <input
                type="url"
                value={vacancyUrl}
                onChange={(event) => setVacancyUrl(event.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleExtractFromUrl}
                disabled={loadingUrl}
                className="btn-primary w-full sm:w-auto disabled:opacity-70"
              >
                {loadingUrl ? "Загрузка..." : "Подтянуть текст по ссылке"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-slate-700 mb-2">Или загрузите файл вакансии</label>
            <input
              type="file"
              accept=".txt,.md,.csv,.json,.log,.rtf,.pdf,.docx,text/plain,text/markdown,application/json,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileUpload}
              className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700"
            />
          </div>

          {sourceLabel && (
            <p className="mt-4 text-sm text-slate-500">
              Источник: <span className="text-slate-700">{sourceLabel}</span>
            </p>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-5">
            <label className="block text-sm text-slate-700 mb-2">Текст вакансии</label>
            <textarea
              value={vacancyText}
              onChange={(event) => setVacancyText(event.target.value)}
              placeholder="Текст появится здесь после загрузки ссылки или файла. Можно редактировать вручную."
              className="w-full min-h-[280px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ResumeMatch);
