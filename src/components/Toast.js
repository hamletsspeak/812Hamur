import React, { useEffect, useState } from 'react';

const FADE_DURATION = 400; // миллисекунд

const Toast = ({ message, type = 'success', onClose, duration = 1000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Плавное появление
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 10); // небольшой таймаут для срабатывания transition

    // Скрываем уведомление чуть раньше, чтобы успела проиграться анимация
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration - FADE_DURATION);

    // onClose вызываем после fade-out
    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed inset-x-0 top-4 mx-auto z-50 flex justify-center pointer-events-none transition-opacity duration-[${FADE_DURATION}ms] ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.4,0,0.2,1)` }}
    >
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg max-w-sm text-center pointer-events-auto transition-transform duration-[${FADE_DURATION}ms] ${visible ? 'scale-100' : 'scale-95'}`}
        style={{ transition: `transform ${FADE_DURATION}ms cubic-bezier(0.4,0,0.2,1)` }}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;