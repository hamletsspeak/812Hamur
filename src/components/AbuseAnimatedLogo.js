import React, { useRef, useEffect } from "react";

// SVG-логотип abuse (минималистичный, можно заменить на свой путь)
const AbuseLogoSVG = () => (
  <svg
    width="120"
    height="40"
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    <text
      x="0"
      y="30"
      fontFamily="'Ruslan Display', 'Montserrat', Arial, sans-serif"
      fontWeight="bold"
      fontSize="32"
      fill="#fff"
      letterSpacing="4"
    >
      abuse
    </text>
  </svg>
);

const AbuseAnimatedLogo = ({ className = "" }) => {
  const ref = useRef();

  useEffect(() => {
    let frame;
    let angle = 0;
    const animate = () => {
      angle += 0.8; // скорость вращения
      if (ref.current) {
        ref.current.style.transform = `perspective(400px) rotateY(${angle}deg)`;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: 120,
        height: 40,
        display: "inline-block",
        willChange: "transform",
        filter: "drop-shadow(0 2px 8px #0008)",
      }}
    >
      <AbuseLogoSVG />
    </div>
  );
};

export default AbuseAnimatedLogo;
