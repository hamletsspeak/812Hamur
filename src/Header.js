import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "./contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  
  const greetings = useMemo(() => [
    "HELLO WORLD!", // English
    "ПРИВЕТ МИР!", // Russian
    "¡HOLA MUNDO!", // Spanish
    "BONJOUR LE MONDE!", // French
    "HALLO WELT!", // German
    "CIAO MONDO!", // Italian
    "OLÁ MUNDO!", // Portuguese
    "HALO DUNIA!", // Indonesian
    "HALLO WERELD!", // Dutch
    "MERHABA DÜNYA!", // Turkish
    "ΓΕΙΑ ΣΟΥ ΚΟΣΜΕ!", // Greek
    "世界你好！" // Chinese
  ], []);

  const period = 2000;
  const delta = 200;

  useEffect(() => {
    const tick = () => {
      let i = loopNum % greetings.length;
      let fullText = greetings[i];
      let updatedText = isDeleting 
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (isDeleting) {
        if (updatedText === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
      } else if (updatedText === fullText) {
        setTimeout(() => {
          setIsDeleting(true);
        }, period);
      }
    };

    let ticker = setInterval(tick, delta);
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
        <p className="text-lg mt-8 text-gray-400">
          Войдите, чтобы увидеть больше информации
        </p>
      )}
    </header>
  );
};

export default Header;
