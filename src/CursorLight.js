import React, { useEffect, useState, useCallback, memo } from 'react';

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

const CursorLight = memo(() => {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback(
    throttle((e) => {
      setPos({ x: e.clientX, y: e.clientY });
    }, 16), // ~60fps
    []
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      style={{
        left: pos.x - 150,
        top: pos.y - 150,
        transform: 'translate3d(0, 0, 0)', // Включаем аппаратное ускорение
        willChange: 'transform', // Оптимизация для анимаций
      }}
      className="pointer-events-none fixed w-[300px] h-[300px] rounded-full bg-white/10 blur-2xl z-10"
    />
  );
});

CursorLight.displayName = 'CursorLight';

export default CursorLight;
