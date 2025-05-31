import React from "react";

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const WebGLGame = () => {
  const mobile = isMobile();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] pt-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-6">WebGL Игра</h1>
      {mobile ? (
        <div className="w-full flex flex-col items-center justify-center">
          <iframe
            src="https://hamletsspeak.github.io/my-portfolio/game/index.html"
            width="360"
            height="640"
            style={{ border: "none", background: "#000", maxWidth: 360, maxHeight: 640 }}
            title="WebGL Game"
            allowFullScreen
          />
          <button
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow transition"
            onClick={() => window.open('https://hamletsspeak.github.io/my-portfolio/game/index.html', '_blank')}
          >
            Открыть игру в новом окне
          </button>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-[#23272f] rounded-2xl shadow-2xl border border-blue-500 p-8 text-center">
          <p className="text-xl text-red-400 font-bold mb-4">Игра доступна только на мобильных устройствах!</p>
          <p className="text-gray-300">Пожалуйста, откройте сайт с мобильного устройства, чтобы поиграть в WebGL-игру.</p>
        </div>
      )}
    </div>
  );
};

export default WebGLGame;
