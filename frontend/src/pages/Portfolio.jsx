import { useState } from "react";
import { motion } from "framer-motion";
import NetworkGraph from "@/components/NetworkGraph";
import VerdictSidebar from "@/components/VerdictSidebar";
import ScrollAnnotations from "@/components/ScrollAnnotations";
import ProjectModal from "@/components/ProjectModal";
import TimelineStrip from "@/components/TimelineStrip";
import AnalysisPanels from "@/components/AnalysisPanels";
import ContactSection from "@/components/ContactSection";
import Reticle from "@/components/Reticle";
import { PROFILE, NODES } from "@/data/profile";

const MARQUEE = [
  "scanning portfolio graph",
  "multi-signal fusion engaged",
  "semantic similarity · 0.78",
  "coordination cluster · 4 nodes",
  "temporal anomaly · Q3-Q4 2025",
  "sentiment uniformity · 0.84",
  "verdict engine · streaming",
  "subject classification · multi-domain",
];

export default function Portfolio() {
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <div className="relative min-h-screen" data-testid="portfolio-root">
      <Reticle />
      <ScrollAnnotations />

      {/* Top bar */}
      <header className="px-6 sm:px-10 lg:px-16 pt-6 pb-3 flex items-center justify-between" data-testid="top-bar">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ background: "#1A1A1A" }}>
            <span className="font-mono text-[9px] text-white tracking-widest">ET</span>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.22em] text-neutral-500 uppercase">Echo Trace · Career Engine</div>
            <div className="font-display text-base leading-none">aiswariya.dossier</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] text-neutral-600 uppercase tracking-widest">
          <a href="#graph" className="hover:text-black" data-reticle="hover">graph</a>
          <a href="#methodology" className="hover:text-black" data-reticle="hover">methodology</a>
          <a href="#timeline" className="hover:text-black" data-reticle="hover">timeline</a>
          <a href="#contact" className="hover:text-black" data-reticle="hover">query</a>
        </nav>
        <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-neutral-500">
          <span className="pulse-dot" /> engine · online
        </div>
      </header>

      {/* Hero / Dashboard */}
      <section id="graph" className="px-6 sm:px-10 lg:px-16 pt-4 pb-10" data-testid="hero-dashboard">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Left: Hero text + graph */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="chip" style={{ background: "#FDF2C8" }}>HackArena 2.0 · National Finalist</span>
                <span className="chip" style={{ background: "#D4EFE1" }}>Echo Trace AI · Team Lead</span>
              </div>
              <h1 className="font-display text-[44px] sm:text-6xl lg:text-7xl leading-[0.98] tracking-tight text-neutral-900">
                The portfolio is the <em className="not-italic" style={{ background: "#F4D8E0", padding: "0 8px" }}>analysis.</em>
              </h1>
              <p className="mt-4 text-neutral-700 max-w-2xl text-[15px] sm:text-base leading-relaxed">
                {PROFILE.tagline}. This page runs the same multi-signal methodology behind <span className="font-mono text-[13px]">Echo Trace AI</span> — except the subject under analysis is <span className="font-mono text-[13px]">{PROFILE.name}</span>.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] text-neutral-600">
                <span>semantic</span><span>·</span>
                <span>temporal</span><span>·</span>
                <span>coordination graph</span><span>·</span>
                <span>sentiment uniformity</span>
              </div>
            </motion.div>

            <div className="relative h-[540px] sm:h-[620px] rounded-2xl bg-white hairline overflow-hidden grain">
              {/* corner marks */}
              <div className="absolute top-3 left-3 font-mono text-[10px] tracking-widest text-neutral-500 uppercase z-10">
                live · network graph
              </div>
              <div className="absolute top-3 right-3 font-mono text-[10px] text-neutral-500 z-10">
                {NODES.length} nodes · drag · click · hover
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-neutral-500 z-10">
                {hover ? `→ ${hover.label}` : "→ hover a node to analyze"}
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-neutral-500 z-10">
                category · {hover?.category ?? "—"}
              </div>
              <NetworkGraph
                onNodeHover={setHover}
                onNodeSelect={setSelected}
                highlightId={hover?.id}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5"><span className="dot pink" /> AI / NLP</span>
                <span className="flex items-center gap-1.5"><span className="dot mint" /> Full-Stack</span>
                <span className="flex items-center gap-1.5"><span className="dot lavender" /> DevOps</span>
                <span className="flex items-center gap-1.5"><span className="dot blue" /> Data</span>
                <span className="flex items-center gap-1.5"><span className="dot yellow" /> Frontend</span>
              </div>
              <span>node radius ∝ project weight</span>
            </div>
          </div>

          {/* Right: live verdict sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <VerdictSidebar focusNode={hover || selected} />
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="hairline-t hairline-b py-3 overflow-hidden bg-white/60" data-testid="marquee">
        <div className="marquee font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-3">
              <span>{m}</span><span className="opacity-30">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div id="methodology"><AnalysisPanels /></div>

      {/* Timeline */}
      <div id="timeline"><TimelineStrip /></div>

      {/* Projects grid */}
      <ProjectsGrid onOpen={setSelected} />

      {/* Contact */}
      <ContactSection />

      <footer className="px-6 sm:px-10 lg:px-16 py-8 hairline-t flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
        <span>echo trace · career engine · v2.6</span>
        <span>© {new Date().getFullYear()} · {PROFILE.name}</span>
      </footer>

      <ProjectModal node={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function ProjectsGrid({ onOpen }) {
  const projects = NODES.filter((n) => n.kind === "project" || n.kind === "role");
  return (
    <section className="px-6 sm:px-10 lg:px-16 py-14" data-testid="projects-grid">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-2">
            Node Index · Click to Expand Dossier
          </div>
          <h3 className="font-display text-4xl sm:text-5xl tracking-tight text-neutral-900 leading-[1.05]">
            Every node, in its own words.
          </h3>
        </div>
        <span className="hidden sm:block font-mono text-[10px] text-neutral-500">
          {projects.length} entries indexed
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <motion.button
            key={p.id}
            data-testid={`project-card-${p.id}`}
            data-reticle="hover"
            onClick={() => onOpen(p)}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="text-left bg-white hairline rounded-2xl p-5 hover:shadow-sm transition relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                {p.kind === "role" ? "experience" : "project"}
              </span>
              {p.badge && (
                <span className="chip" style={{ background: "#FDF2C8", fontSize: "9px" }}>
                  finalist
                </span>
              )}
            </div>
            <div className="font-display text-2xl text-neutral-900 leading-tight">{p.label}</div>
            <div className="text-[13px] text-neutral-600 mt-1.5">{p.headline}</div>
            <div className="mt-4 flex flex-wrap gap-1">
              {(p.tech || []).slice(0, 4).map((t) => (
                <span key={t} className="font-mono text-[10px] text-neutral-500">{t}</span>
              )).reduce((acc, el, idx, arr) => {
                if (idx === 0) return [el];
                return [...acc, <span key={`s-${idx}`} className="font-mono text-[10px] text-neutral-300">·</span>, el];
              }, [])}
            </div>
            <span className="absolute right-4 bottom-4 font-mono text-[10px] text-neutral-400 group-hover:text-neutral-800 transition">
              expand →
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
