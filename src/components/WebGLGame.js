import React from "react";

const WebGLGame = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] pt-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-6">WebGL Игра</h1>
      <div className="w-full flex flex-col items-center justify-center">
        <iframe
          src="https://hamletsspeak.github.io/my-portfolio/game/index.html"
          width="960"
          height="600"
          style={{ border: "none", background: "#000" }}
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
      <p className="text-gray-400 mt-6 text-center">Если игра не загружается, убедитесь, что вы скопировали папку <b>game</b> в <b>public</b>.</p>
    </div>
  );
};

export default WebGLGame;
