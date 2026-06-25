import { useEffect, useState } from "react";

export default function Reticle() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  // size override from external "lock-on" events (e.g. graph node hover)
  const [lockSize, setLockSize] = useState(null);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const enter = () => setHover(true);
    const leave = () => setHover(false);
    const onLock = (e) => {
      const s = e?.detail?.size;
      setLockSize(typeof s === "number" && s > 0 ? s : null);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("reticle:lock", onLock);
    document.querySelectorAll("[data-reticle='hover']").forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("reticle:lock", onLock);
    };
  }, []);

  const lockedStyle = lockSize
    ? { width: lockSize, height: lockSize }
    : null;

  return (
    <div
      className={`reticle ${hover ? "hover" : ""} ${lockSize ? "locked" : ""}`}
      style={{ left: pos.x, top: pos.y, ...(lockedStyle || {}) }}
      data-testid="cursor-reticle"
    >
      <span className="reticle-tick reticle-tick-top" />
      <span className="reticle-tick reticle-tick-right" />
      <span className="reticle-tick reticle-tick-bottom" />
      <span className="reticle-tick reticle-tick-left" />
    </div>
  );
}
