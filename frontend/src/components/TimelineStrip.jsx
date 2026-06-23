import { motion } from "framer-motion";

const POINTS = [
  { year: "2024", density: 0.18, label: "Foundations" },
  { year: "2025 H1", density: 0.42, label: "Freelance + Web Dev" },
  { year: "2025 H2", density: 0.81, label: "Echo Trace AI · WICE" },
  { year: "2026", density: 0.94, label: "AI / Agentic Focus" },
];

export default function TimelineStrip() {
  return (
    <section className="px-6 sm:px-10 lg:px-16 py-12" data-testid="timeline-strip">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-3xl sm:text-4xl tracking-tight text-neutral-900">
          Growth Trajectory
        </h3>
        <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
          Node density · connection strength
        </span>
      </div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-12 h-px bg-neutral-200" />
        <div className="grid grid-cols-4 gap-4 relative">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.year}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative h-24 w-24 mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="38" fill="#F3F2EF" />
                  <motion.circle
                    cx="50" cy="50"
                    r={10 + p.density * 28}
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    fill={["#F4D8E0", "#D8EBF6", "#D4EFE1", "#E6DDF8"][i]}
                  />
                  <text x="50" y="55" textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono" fill="#1A1A1A">
                    {Math.round(p.density * 100)}
                  </text>
                </svg>
              </div>
              <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">{p.year}</div>
              <div className="font-display text-lg text-neutral-900 mt-0.5">{p.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
