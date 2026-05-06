import React, { useState } from 'react';
import { askOpenRouter } from '../services/openRouterService';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Привет. Я AI-агент сайта, задайте вопрос.' }
  ]);
  const [loading, setLoading] = useState(false);

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
      <div className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
        AI Assistant
      </div>
      <div className="h-72 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        {messages.map((message, index) => (
          <div key={index} className={message.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={message.role === 'user' ? 'inline-block rounded-xl bg-sky-600 px-3 py-2 text-white' : 'inline-block rounded-xl bg-slate-100 px-3 py-2 text-slate-900'}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={onSend} className="flex gap-2 border-t border-slate-200 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спросите что угодно..."
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
    </div>
  );
};

export default AIAssistant;
