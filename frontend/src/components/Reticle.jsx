import { useEffect, useState } from "react";

export default function Reticle() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const enter = () => setHover(true);
    const leave = () => setHover(false);
    window.addEventListener("mousemove", move);
    document.querySelectorAll("[data-reticle='hover']").forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div
      className={`reticle ${hover ? "hover" : ""}`}
      style={{ left: pos.x, top: pos.y }}
      data-testid="cursor-reticle"
    />
  );
}
