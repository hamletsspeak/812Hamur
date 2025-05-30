import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "./contexts/AuthContext";
import Auth from './components/Auth';
import { useLanguage } from "./contexts/LanguageContext";

const Header = () => {
  const { user } = useAuth();
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const { t } = useLanguage();

  const greetings = useMemo(() => [
    t("helloWorld"),
    "BONJOUR LE MONDE!",
    "¡HOLA MUNDO!",
    "HALLO WELT!",
    "CIAO MONDO!",
    "OLÁ MUNDO!",
    "HALO DUNIA!",
    "HALLO WERELD!",
    "MERHABA DÜNYA!",
    "ΓΕΙΑ ΣΟΥ ΚΟΣΜΕ!",
    "世界你好！"
  ], [t]);

  const period = 2000;
  const delta = 200;

  useEffect(() => {
    let ticker = null;
    
    const tick = () => {
      let i = loopNum % greetings.length;
      let fullText = greetings[i];
      let updatedText = isDeleting 
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), period);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(prev => prev + 1);
      }
    };

    ticker = setInterval(tick, delta);
    return () => clearInterval(ticker);
  }, [displayText, isDeleting, loopNum, greetings, period, delta]);

  return (
    <header id="header" className="snap-start min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white text-center px-4">
      <div>
        <h1 className="text-5xl sm:text-7xl font-bold">
          {displayText}
          <span className="text-blue-500 animate-pulse">|</span>
        </h1>
      </div>
      {!user && (
        <button
          className="text-lg mt-8 text-blue-400 hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
          onClick={() => setShowAuth(true)}
          type="button"
        >
          {t("loginToSeeMore")}
        </button>
      )}
      <div className="mt-4">
        {/* Переключатель языка удалён, теперь он только в Navbar */}
      </div>
      <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </header>
  );
};

export default Header;
