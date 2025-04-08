import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="fixed inset-x-0 top-4 mx-auto z-50 flex justify-center animate-fade-in-down">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg max-w-sm text-center`}>
        {message}
      </div>
    </div>
  );
};

export default Toast;