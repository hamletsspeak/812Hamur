import React, { useState, useEffect } from "react";

const COOKIE_KEY = "cookie_consent_accepted";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-end pointer-events-none px-4 pb-4">
      <div className="pointer-events-auto glass-card rounded-2xl shadow-xl p-4 max-w-xl w-full flex flex-col sm:flex-row items-center gap-4">
        <span className="flex-1 text-sm text-slate-600 leading-relaxed">
          Сайт использует cookie для базовой работы интерфейса. Продолжая пользоваться сайтом,
          вы соглашаетесь с этим.
        </span>
        <button type="button" onClick={handleAccept} className="btn-primary font-semibold shrink-0">
          Принять
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
