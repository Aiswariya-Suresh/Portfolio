import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CATEGORIES } from "@/data/profile";

const SECTIONS = [
  { key: "problem", label: "Problem Identified" },
  { key: "why", label: "Why I Chose It" },
  { key: "role", label: "Role & Contributions" },
  { key: "challenges", label: "Challenges" },
  { key: "decisions", label: "Decisions Made" },
  { key: "outcomes", label: "Outcomes & Impact" },
  { key: "learnings", label: "Learnings" },
];

export default function ProjectModal({ node, onClose }) {
  const cat = node ? CATEGORIES[node.category] : null;
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          data-testid="project-modal"
        >
          <div
            className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative glass rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-7 sm:p-10"
          >
            <button
              onClick={onClose}
              data-testid="project-modal-close"
              data-reticle="hover"
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-neutral-100 transition"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span
                className="chip"
                style={{ background: cat?.color || "#F4D8E0" }}
              >
                {cat?.label}
              </span>
              {node.badge && (
                <span className="chip" style={{ background: "#FDF2C8" }}>
                  {node.badge}
                </span>
              )}
              {node.period && (
                <span className="font-mono text-[10px] text-neutral-500">{node.period}</span>
              )}
            </div>

            <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight text-neutral-900">
              {node.label}
            </h2>
            {node.headline && (
              <p className="mt-2 text-neutral-600 text-sm sm:text-base">{node.headline}</p>
            )}

            {node.tech && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {node.tech.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            )}

            <div className="mt-7 grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {SECTIONS.filter((s) => node[s.key]).map((s) => (
                <div key={s.key}>
                  <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-1.5">
                    {s.label}
                  </div>
                  <p className="text-neutral-800 text-[14.5px] leading-relaxed">{node[s.key]}</p>
                </div>
              ))}
              {node.body && (
                <div className="sm:col-span-2">
                  <p className="text-neutral-800 text-[14.5px] leading-relaxed">{node.body}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
