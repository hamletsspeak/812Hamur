import React, { useRef, useState } from "react";
import hiddenVideo from "./icons/09cb2a5fe3b0ca1cee32fda8ce04c218_t4.mp4";
import memeKaif from "./icons/mems/кайф.jpg";
import memeThree from "./icons/mems/1 Стикер телеграм 🙂 из набора «Bluemoji or Joobi».jpg";
import memeTwo from "./icons/mems/Без названия (7).jpg";
import memeOneA from "./icons/mems/meme-one-a.jpg";
import memeOneB from "./icons/mems/Без названия (5).jpg";
import memeOneC from "./icons/mems/Без названия (4).jpg";
import memeOneD from "./icons/mems/-aura.jpg";
import memeOneE from "./icons/mems/★.jpg";
import memeOneF from "./icons/mems/Без названия (6).jpg";
import memeOneG from "./icons/mems/omg.jpg";
import memeOneH from "./icons/mems/Dunbahh.jpg";
import { saveSiteRating } from "./services/ratingService";

const SecretVideoSection = () => {
  const videoRef = useRef(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [oneClickIndex, setOneClickIndex] = useState(0);
  const [oneMeme, setOneMeme] = useState(null);
  const [oneEvadeMode, setOneEvadeMode] = useState(false);
  const [oneEvadeCount, setOneEvadeCount] = useState(0);
  const [oneConvertedToFive, setOneConvertedToFive] = useState(false);
  const [oneButtonStyle, setOneButtonStyle] = useState({ transform: "translate(0px, 0px)", opacity: 1 });
  const [isOneHovered, setIsOneHovered] = useState(false);

  const reactionByRating = {
    1: "это было больно, но честно.",
    2: "«ну почти, но нет».",
    3: "«норм, работаем дальше».",
    4: "«уже хорошо, почти легенда».",
    5: "максимальный респект.",
  };

  const oneMemeSequence = [memeOneA, memeOneB, memeOneC, memeOneD, memeOneE, memeOneF, memeOneG, memeOneH];
  const activeMeme =
    selectedRating === 1
      ? oneMeme
      : selectedRating === 2
        ? memeTwo
        : selectedRating === 3
          ? memeThree
          : selectedRating === 4
            ? memeKaif
            : null;

  const handleRate = async (rating) => {
    if (rating === 1) {
      setOneButtonStyle({ transform: "translate(0px, 0px)", opacity: 1 });
      if (oneConvertedToFive) {
        await handleRatingFiveFlow();
        return;
      }

      const currentClicks = oneClickIndex;
      const nextIndex = Math.min(currentClicks, oneMemeSequence.length - 1);
      const nextClicks = currentClicks + 1;
      setSelectedRating(1);
      setError("не получилось сохранить оценку");
      setStatusText("");
      setShowVideo(false);
      setOneMeme(oneMemeSequence[nextIndex]);
      setOneClickIndex(nextClicks);
      const shouldEvade = nextClicks >= oneMemeSequence.length;
      setOneEvadeMode(shouldEvade);
      if (shouldEvade) {
        window.setTimeout(() => {
          moveOneButtonAway();
        }, 0);
      }
      return;
    }

    setOneMeme(null);
    setOneEvadeMode(false);
    setOneEvadeCount(0);
    setOneButtonStyle({ transform: "translate(0px, 0px)", opacity: 1 });
    setOneConvertedToFive(false);

    if (isSaving) return;
    setSelectedRating(rating);
    setIsSaving(true);
    setError("");
    setStatusText("");

    try {
      const result = await saveSiteRating(rating);
      if (result.saved) {
        setStatusText("Спасибо, первая оценка сохранена.");
      } else {
        setStatusText("Оценка уже была сохранена ранее. Можно нажимать дальше для реакций.");
      }
    } catch (error) {
      setError("");
      setShowVideo(false);
    } finally {
      setIsSaving(false);
    }

    if (rating === 5 && videoRef.current) {
      setShowVideo(true);
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      try {
        await videoRef.current.play();
      } catch (playError) {
        setStatusText("");
      }
    } else {
      setShowVideo(false);
    }
  };

  const handleRatingFiveFlow = async () => {
    if (isSaving) return;
    setSelectedRating(5);
    setIsSaving(true);
    setError("");
    setStatusText("");
    setOneMeme(null);

    try {
      const result = await saveSiteRating(5);
      if (result.saved) {
        setStatusText("Спасибо, первая оценка сохранена.");
      } else {
        setStatusText("Оценка уже была сохранена ранее. Можно нажимать дальше для реакций.");
      }
    } catch (saveError) {
      setShowVideo(false);
    } finally {
      setIsSaving(false);
    }

    if (videoRef.current) {
      setShowVideo(true);
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      try {
        await videoRef.current.play();
      } catch (playError) {
        setStatusText("");
      }
    }
  };

  const moveOneButtonAway = () => {
    if (!oneEvadeMode || oneConvertedToFive) return;
    if (oneClickIndex < oneMemeSequence.length) return;
    const x = Math.floor(Math.random() * 240) - 120;
    const y = Math.floor(Math.random() * 120) - 60;
    const nextCount = oneEvadeCount + 1;
    setOneButtonStyle((prev) => ({ ...prev, opacity: 0 }));
    window.setTimeout(() => {
      if (nextCount >= 5) {
        setOneEvadeMode(false);
        setOneConvertedToFive(true);
        setOneButtonStyle({ transform: "translate(0px, 0px)", opacity: 1 });
        return;
      }
      setOneButtonStyle({ transform: `translate(${x}px, ${y}px)`, opacity: 1 });
    }, 120);
    setOneEvadeCount(nextCount);
  };

  const handleOneHover = () => {
    moveOneButtonAway();
  };

  return (
    <section id="hidden-video" className="snap-start min-h-screen px-5 py-24">
      <div className="max-w-6xl mx-auto min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/70 px-4 py-7 sm:px-10 sm:py-10 text-center shadow-sm">
          <h2 className="text-2xl leading-tight sm:text-4xl text-slate-900 font-bold tracking-tight">Оцените сайт, пожалуйста</h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-base">
            Анонимно, без сохранения персональных данных.
          </p>

          <div className="mt-7 relative group">
            <div className="flex items-center justify-center gap-2 sm:gap-3 relative h-14">
            <button
              type="button"
              onClick={() => handleRate(1)}
              onMouseEnter={() => {
                setIsOneHovered(true);
                handleOneHover();
              }}
              onMouseLeave={() => setIsOneHovered(false)}
              onFocus={() => setIsOneHovered(true)}
              onBlur={() => setIsOneHovered(false)}
              disabled={isSaving}
              style={oneButtonStyle}
              className={`relative z-10 h-12 w-12 rounded-xl border text-lg font-bold transition-all duration-150 ${
                selectedRating >= 1
                  ? "border-sky-500 bg-sky-100 text-sky-700"
                  : "border-slate-300 bg-white text-slate-700"
              } hover:-translate-y-0.5 disabled:opacity-60 ${oneConvertedToFive ? "animate-pulse" : ""}`}
              aria-label={oneConvertedToFive ? "Оценка 5" : "Оценка 1"}
            >
              {oneConvertedToFive ? 5 : 1}
            </button>
            {[2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRate(value)}
                disabled={isSaving}
                className={`h-12 w-12 rounded-xl border text-lg font-bold transition-all ${
                  selectedRating >= value
                    ? "border-sky-500 bg-sky-100 text-sky-700"
                    : "border-slate-300 bg-white text-slate-700"
                } hover:-translate-y-0.5 disabled:opacity-60`}
                aria-label={`Оценка ${value}`}
              >
                {value}
              </button>
            ))}
            </div>
            <p className={`pointer-events-none mt-2 text-xs text-slate-500 transition-opacity duration-300 ${isOneHovered ? "opacity-60" : "opacity-0"}`}>
              На оценку 1 можно нажимать несколько раз
            </p>
          </div>

          <div className="mt-4 min-h-[48px]">
            {statusText && (
              <p className="text-emerald-700 text-sm">{statusText}</p>
            )}
            {error && (
              <p className="text-rose-700 text-sm">{error}</p>
            )}
            {selectedRating > 0 && (
              <p className="mt-2 text-slate-700 text-base">{reactionByRating[selectedRating]}</p>
            )}
          </div>

          <div className="mt-5 min-h-[260px] sm:min-h-[340px] flex items-start justify-center">
            <div className="w-full max-w-md h-[260px] sm:h-[340px] rounded-2xl border border-slate-300 bg-slate-100 overflow-hidden flex items-center justify-center">
              {showVideo ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain bg-slate-200"
                  playsInline
                  preload="metadata"
                  controls
                >
                  <source src={hiddenVideo} type="video/mp4" />
                </video>
              ) : activeMeme ? (
                <img
                  src={activeMeme}
                  alt={`Реакция на оценку ${selectedRating}`}
                  className={`w-full h-full ${
                    selectedRating === 1 ? "object-cover object-center" : "object-contain object-center"
                  }`}
                />
              ) : null}
            </div>
          </div>
          {!showVideo && (
            <video ref={videoRef} className="hidden" playsInline preload="metadata">
              <source src={hiddenVideo} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecretVideoSection;
