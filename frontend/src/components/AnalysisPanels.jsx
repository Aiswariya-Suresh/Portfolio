import { motion } from "framer-motion";

const PANELS = [
  {
    key: "linguistic",
    title: "Linguistic Pattern",
    metric: "structured",
    color: "#F4D8E0",
    body: "Project descriptions follow a consistent problem → decision → outcome framing — uncommon in early-career profiles. Suggests reflective practice.",
  },
  {
    key: "temporal",
    title: "Temporal Activity",
    metric: "Q3-Q4 ’25 burst",
    color: "#D8EBF6",
    body: "Sharp activity spike in late 2025: Echo Trace AI (hackathon) + WICE deployment + scaling freelance work in a single quarter.",
  },
  {
    key: "coordination",
    title: "Coordination Graph",
    metric: "2-node leadership",
    color: "#D4EFE1",
    body: "Echo Trace AI: tight 2-member collaboration, lead role. Otherwise high autonomy — solo build cadence is strong.",
  },
  {
    key: "sentiment",
    title: "Sentiment Uniformity",
    metric: "0.84",
    color: "#E6DDF8",
    body: "Tone across self-descriptions clusters tightly around curiosity, ownership, and pragmatism. Consistent voice; low contradiction.",
  },
];

export default function AnalysisPanels() {
  return (
    <section className="px-6 sm:px-10 lg:px-16 py-14" data-testid="analysis-panels">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-2">
            Echo Trace Methodology · Applied to Career
          </div>
          <h3 className="font-display text-4xl sm:text-5xl tracking-tight text-neutral-900 leading-[1.05]">
            Four signals, one verdict.
          </h3>
        </div>
        <span className="hidden sm:block font-mono text-[10px] text-neutral-500">
          Same engine that powers Echo Trace AI — now profiling its creator.
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
            className="rounded-2xl bg-white hairline p-5 relative overflow-hidden"
            data-testid={`panel-${p.key}`}
          >
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
              style={{ background: p.color, opacity: 0.7 }}
            />
            <div className="relative">
              <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                {p.title}
              </div>
              <div className="font-display text-3xl mt-2 mb-3 text-neutral-900">{p.metric}</div>
              <p className="text-[13px] text-neutral-700 leading-relaxed">{p.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
