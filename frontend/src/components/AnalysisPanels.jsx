import { motion } from "framer-motion";

const PANELS = [
  {
    key: "linguistic",
    title: "Linguistic Pattern",
    metric: "structured",
    bg: "#FDF2C8",
    chip: "#F8E59A",
    body: "My project descriptions follow a consistent problem → decision → outcome framing. I prefer to explain why a choice was made, not just what was built.",
  },
  {
    key: "temporal",
    title: "Temporal Activity",
    metric: "Q3-Q4 '25 burst",
    bg: "#D8EBF6",
    chip: "#B7DCEF",
    body: "Late 2025 was my densest stretch: Echo Trace AI for HackArena, the WICE DevOps role going live, and freelance work scaling up — all in one quarter.",
  },
  {
    key: "coordination",
    title: "Coordination Graph",
    metric: "lead · 2-node",
    bg: "#D4EFE1",
    chip: "#B6E5CC",
    body: "I led a tight 2-member team on Echo Trace AI — owning architecture, AI pipeline, and presentation. Solo build cadence is strong on everything else.",
  },
  {
    key: "sentiment",
    title: "Sentiment Uniformity",
    metric: "0.84",
    bg: "#E6DDF8",
    chip: "#CDBFEF",
    body: "Across how I describe my work, the tone clusters around curiosity, ownership, and pragmatism. I aim for a consistent voice, low contradiction, and real reflection.",
  },
];

export default function AnalysisPanels() {
  return (
    <section className="px-6 sm:px-10 lg:px-16 py-14" data-testid="analysis-panels">
      <div className="flex items-end justify-between mb-8 gap-6">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase mb-2">
            Echo Trace Methodology · Applied to My Own Career
          </div>
          <h3 className="font-display text-4xl sm:text-5xl tracking-tight text-neutral-900 leading-[1.05]">
            Four signals, <em className="not-italic" style={{ background: "#D4EFE1", padding: "0 6px" }}>one self-portrait</em>.
          </h3>
        </div>
        <span className="hidden sm:block font-mono text-[10px] text-neutral-600 text-right max-w-[220px] leading-relaxed">
          The same engine I built for Echo Trace AI — turned inward, with me as the subject.
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PANELS.map((p, i) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="rounded-2xl p-5 relative overflow-hidden hairline"
            style={{ background: p.bg }}
            data-testid={`panel-${p.key}`}
          >
            <div
              className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-60"
              style={{ background: p.chip }}
            />
            <div className="relative">
              <div className="font-mono text-[10px] tracking-widest text-neutral-700 uppercase">
                {p.title}
              </div>
              <div className="font-display text-3xl mt-2 mb-3 text-neutral-900">{p.metric}</div>
              <p className="text-[13px] text-neutral-800 leading-relaxed">{p.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
