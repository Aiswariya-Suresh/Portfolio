import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ANNOTATIONS } from "@/data/profile";

export default function ScrollAnnotations() {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      const active = ANNOTATIONS.filter((a) => p >= a.at && p < a.at + 0.08);
      setVisible(active.slice(-2));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed left-6 bottom-6 z-30 flex flex-col gap-2 pointer-events-none"
      data-testid="scroll-annotations"
    >
      <AnimatePresence>
        {visible.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="glass rounded-full px-3.5 py-1.5 font-mono text-[11px] text-neutral-800 flex items-center gap-2"
          >
            <span className="pulse-dot" />
            {a.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
