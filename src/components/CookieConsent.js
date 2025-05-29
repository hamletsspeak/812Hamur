import React, { useState, useEffect } from 'react';

const COOKIE_KEY = 'cookie_consent_accepted';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-end pointer-events-none">
      <div className="pointer-events-auto bg-[#23272f] text-gray-200 border border-[#374151] rounded-t-xl shadow-xl p-4 mb-2 max-w-xl w-full flex flex-col sm:flex-row items-center gap-4 animate-fadeInUp">
        <span className="flex-1 text-sm text-gray-300">
          Этот сайт использует cookie-файлы для улучшения пользовательского опыта. Продолжая использовать сайт, вы соглашаетесь с <a href="/privacy" className="underline text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>.
        </span>
        <button
          onClick={handleAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
        >
          Принять
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
