import React, { useEffect, useState } from 'react';

const CursorLight = () => {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        left: pos.x - 150,
        top: pos.y - 150,
      }}
      className="pointer-events-none fixed w-[300px] h-[300px] rounded-full bg-white/10 blur-2xl z-10 transition-transform duration-75"
    ></div>
  );
};


export default CursorLight;
