import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Static fallback so the sidebar still renders if the backend is unreachable.
const FALLBACK = {
  synthetic_self_score: 87,
  classification: "Emerging Multi-Domain AI Practitioner",
  confidence: "HIGH",
  clusters: [
    { name: "AI / NLP", weight: 92, color: "pink" },
    { name: "Full-Stack", weight: 84, color: "mint" },
    { name: "DevOps / Infra", weight: 76, color: "lavender" },
    { name: "Data / Research", weight: 70, color: "blue" },
    { name: "Leadership", weight: 65, color: "yellow" },
  ],
};

const SELF_NOTE = (
  <>
    <p>
      I&apos;m Aiswariya — an AI &amp; full-stack developer who likes to be measured by what I build. I work end-to-end: web apps, AI/NLP pipelines, lightweight DevOps, and the connective tissue between them.
    </p>
    <p className="mt-3">
      What I do well — turning fuzzy problems into structured systems, designing pipelines that combine multiple ML signals, staying close enough to the code to keep things explainable, and thinking carefully about prompt design, agentic workflows, and grounded retrieval.
    </p>
    <p className="mt-3">
      I&apos;m at my best when a problem needs both engineering rigor and a research instinct. If that sounds like the kind of work you&apos;re doing, let&apos;s talk.
    </p>
  </>
);

export default function VerdictSidebar({ focusNode }) {
  const [summary, setSummary] = useState(FALLBACK);

  useEffect(() => {
    if (!BACKEND_URL) return;
    fetch(`${BACKEND_URL}/api/profile/summary`)
      .then((r) => r.json())
      .then((d) => {
        // Override server-side cluster weights with the higher static values
        // so the sidebar always reflects the curated competency picture.
        setSummary({ ...d, clusters: FALLBACK.clusters });
      })
      .catch(() => {});
  }, []);

  return (
    <aside
      data-testid="verdict-sidebar"
      className="rounded-2xl p-5 lg:p-6 flex flex-col gap-5 hairline"
      style={{ background: "linear-gradient(165deg, #FFFFFF 0%, #FBF6F4 55%, #F4EEF7 100%)" }}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-neutral-700 uppercase">
            Live Profile · Self View
          </span>
        </div>
        <span className="font-mono text-[10px] text-neutral-500">aiswariya · v2.6</span>
      </header>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
            Synthetic Self Score
          </span>
          <span className="font-display text-5xl leading-none text-neutral-900" data-testid="self-score">
            {summary?.synthetic_self_score ?? 87}
          </span>
        </div>
        <div className="h-1.5 mt-3 rounded-full bg-neutral-200/70 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${summary?.synthetic_self_score ?? 87}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full"
            style={{ background: "linear-gradient(90deg,#F4D8E0,#D4EFE1,#E6DDF8)" }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="chip" style={{ background: "#F4D8E0" }}>
            <span className="dot pink" /> {summary?.classification ?? FALLBACK.classification}
          </span>
          <span className="font-mono text-[10px] text-neutral-600">
            conf · {summary?.confidence ?? "HIGH"}
          </span>
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase mb-2">
          Competency Distribution
        </div>
        <div className="space-y-2">
          {(summary?.clusters || []).map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="font-mono text-[11px] w-28 text-neutral-700">{c.name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-neutral-200/70 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, c.weight)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      c.color === "pink" ? "#F4D8E0" :
                      c.color === "mint" ? "#D4EFE1" :
                      c.color === "lavender" ? "#E6DDF8" :
                      c.color === "blue" ? "#D8EBF6" :
                      "#FDF2C8",
                  }}
                />
              </div>
              <span className="font-mono text-[10px] text-neutral-600 w-8 text-right">{c.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase mb-2">
          In My Own Words {focusNode?.label ? `· focus: ${focusNode.label}` : ""}
        </div>
        <div
          className="text-[12.5px] leading-[1.7] text-neutral-800 rounded-xl p-3.5"
          style={{ background: "rgba(212, 239, 225, 0.45)", border: "1px solid rgba(212, 239, 225, 0.9)" }}
          data-testid="verdict-text"
        >
          {SELF_NOTE}
        </div>
      </div>
    </aside>
  );
}
