import { useState, useEffect } from "react";

export function useTypewriter(text, speed = 30) {
  // Показываем весь текст сразу, но для анимации печати возвращаем массив символов с флагом "напечатан/нет"
  const [printed, setPrinted] = useState(text.length);

  useEffect(() => {
    setPrinted(0);
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setPrinted(i);
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  // Возвращаем массив: каждый символ с флагом "напечатан" (true/false)
  return Array.from(text).map((char, idx) => ({
    char,
    visible: idx < printed
  }));
}
