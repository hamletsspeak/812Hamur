import React, { useState } from "react";
import aiGif from "../icons/ai-assistant-sticker-v2.gif";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="max-w-[280px] rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
          <p className="text-sm text-slate-700 leading-relaxed">
            Здесь живёт AI-помощник сайта: помогает с подсказками по разделам и ускоряет
            навигацию по портфолио.
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-white/80 shadow-lg transition-transform hover:scale-105"
        aria-label="Показать информацию об ИИ помощнике"
        aria-expanded={isOpen}
      >
        <img src={aiGif} alt="AI помощник" className="h-full w-full object-cover" />
      </button>
    </div>
  );
};

export default AIAssistant;
