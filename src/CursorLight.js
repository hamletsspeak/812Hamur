import React, { useEffect, useState, useRef, memo } from 'react';

// Вынесенная функция throttle
function throttle(func, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const CursorLight = memo(() => {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const throttledSetPos = useRef(throttle((e) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, 16));

  useEffect(() => {
    const handler = throttledSetPos.current;
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Не показывать свечение на мобильных
  if (typeof window !== 'undefined' && window.innerWidth <= 640) {
    return null;
  }

  return (
    <div
      style={{
        left: pos.x - 150,
        top: pos.y - 150,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
      }}
      className="pointer-events-none fixed w-[300px] h-[300px] rounded-full bg-white/10 blur-2xl z-10"
    />
  );
});

CursorLight.displayName = 'CursorLight';

export default CursorLight;
