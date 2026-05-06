import React, { useEffect, useRef, useState } from 'react';
import { askOpenRouter } from '../services/openRouterService';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Привет. Я ассистент этого сайта.\n\nПримеры запросов:\n1. Какие у Гамлета ключевые навыки?\n2. Где посмотреть проекты?\n3. Какой последний опыт работы?\n4. Какие контакты для связи?\n5. Что указано в резюме по зарплате и городу?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const onSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const history = nextMessages
        .slice(0, -1)
        .map(({ role, content }) => ({ role, content }));
      const response = await askOpenRouter(text, history);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Ошибка: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[350px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900 flex items-center justify-between">
        <span>AI Assistant</span>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          {isOpen ? 'Свернуть' : 'Развернуть'}
        </button>
      </div>
      {isOpen && (
        <>
          <div className="h-72 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((message, index) => (
              <div key={index} className={message.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={message.role === 'user' ? 'inline-block rounded-xl bg-sky-600 px-3 py-2 text-white whitespace-pre-line' : 'inline-block rounded-xl bg-slate-100 px-3 py-2 text-slate-900 whitespace-pre-line'}>
                  {message.content}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:120ms]" />
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:240ms]" />
                  Печатает...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={onSend} className="flex gap-2 border-t border-slate-200 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите про сайт или Гамлета..."
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
