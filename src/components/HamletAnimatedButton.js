import React from "react";

const HamletAnimatedButton = () => {
  return (
    <img
      src="public/Logo2.gif"
      alt="Hamlet 3D gif"
      style={{
        width: 140,
        height: 60,
        objectFit: "contain",
        display: "block",
        background: "none",
        border: "none",
        margin: 0,
        padding: 0,
        pointerEvents: "auto",
        userSelect: "auto",
      }}
      draggable={false}
    />
  );
};

export default HamletAnimatedButton;
