import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
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
            <span className="font-mono text-[9px] text-white tracking-widest">AS</span>
          </div>
          <div className="font-display text-base leading-none">aiswariya.s</div>
        </div>
        <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] text-neutral-600 uppercase tracking-widest">
          <a href="#graph" className="hover:text-black" data-reticle="hover">graph</a>
          <a href="#methodology" className="hover:text-black" data-reticle="hover">methodology</a>
          <a href="#timeline" className="hover:text-black" data-reticle="hover">timeline</a>
          <a href="#contact" className="hover:text-black" data-reticle="hover">query</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Aiswariya-Suresh"
            target="_blank"
            rel="noreferrer"
            data-testid="social-github"
            data-reticle="hover"
            aria-label="GitHub"
            className="h-8 w-8 rounded-full hairline flex items-center justify-center hover:bg-neutral-900 hover:text-white transition text-neutral-700"
          >
            <Github size={14} />
          </a>
          <a
            href="https://www.linkedin.com/in/aiswariya-s/"
            target="_blank"
            rel="noreferrer"
            data-testid="social-linkedin"
            data-reticle="hover"
            aria-label="LinkedIn"
            className="h-8 w-8 rounded-full hairline flex items-center justify-center hover:bg-neutral-900 hover:text-white transition text-neutral-700"
          >
            <Linkedin size={14} />
          </a>
          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-neutral-500 pl-2 ml-1 hairline-l">
            <span className="pulse-dot" /> engine · online
          </div>
        </div>
      </header>

      {/* Hero / Dashboard */}
      <section id="graph" className="px-6 sm:px-10 lg:px-16 pt-4 pb-10" data-testid="hero-dashboard">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] tracking-[0.22em] text-neutral-500 uppercase">
                  career engine · live analysis
                </span>
              </div>
              <h1 className="font-display text-[44px] sm:text-6xl lg:text-7xl leading-[0.98] tracking-tight text-neutral-900">
                The portfolio is the <em className="not-italic" style={{ background: "#F4D8E0", padding: "0 8px" }}>analysis.</em>
              </h1>
              <p className="mt-4 text-neutral-700 max-w-2xl text-[15px] sm:text-base leading-relaxed">
                {PROFILE.tagline}.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] text-neutral-600">
                <span>semantic</span><span>·</span>
                <span>temporal</span><span>·</span>
                <span>coordination graph</span><span>·</span>
                <span>sentiment uniformity</span>
              </div>
            </motion.div>

            <div className="relative h-[540px] sm:h-[620px] rounded-2xl bg-white hairline overflow-hidden grain">
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

          <div className="lg:sticky lg:top-6 lg:self-start">
            <VerdictSidebar focusNode={hover || selected} />
          </div>
        </div>
      </section>

      <div className="hairline-t hairline-b py-3 overflow-hidden bg-white/60" data-testid="marquee">
        <div className="marquee font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-3">
              <span>{m}</span><span className="opacity-30">/</span>
            </span>
          ))}
        </div>
      </div>

      <div id="methodology"><AnalysisPanels /></div>
      <div id="timeline"><TimelineStrip /></div>
      <ProjectsGrid onOpen={setSelected} />
      <ContactSection />

      <footer className="px-6 sm:px-10 lg:px-16 py-10 hairline-t" data-testid="site-footer">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ background: "#1A1A1A" }}>
              <span className="font-mono text-[9px] text-white tracking-widest">AS</span>
            </div>
            <div className="font-display text-base leading-none text-neutral-900 normal-case tracking-normal">aiswariya.s</div>
          </div>
          <span>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</span>
          <span>designed · built · analyzed — by aiswariya s</span>
        </div>
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
        {projects.map((p, i) => {
          const tint =
            p.category === "ai" ? "#FBE7EE" :
            p.category === "fullstack" ? "#E3F5EB" :
            p.category === "devops" ? "#EFE7FA" :
            p.category === "data" ? "#E5F1F9" :
            p.category === "frontend" ? "#FCF6D6" :
            "#FBE7EE";
          return (
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
            className="text-left hairline rounded-2xl p-5 hover:shadow-sm transition relative overflow-hidden group"
            style={{ background: `linear-gradient(165deg, #FFFFFF 0%, ${tint} 120%)` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
                {p.kind === "role" ? "experience" : "project"}
              </span>
              {p.badge && (
                <span className="chip" style={{ background: "#FDF2C8", fontSize: "9px" }}>
                  finalist
                </span>
              )}
            </div>
            <div className="font-display text-2xl text-neutral-900 leading-tight">{p.label}</div>
            <div className="text-[13px] text-neutral-700 mt-1.5">{p.headline}</div>
            <div className="mt-4 flex flex-wrap gap-x-1.5 gap-y-0.5">
              {(p.tech || []).slice(0, 4).map((t, idx, arr) => (
                <span key={t} className="font-mono text-[10px] text-neutral-600">
                  {t}{idx < arr.length - 1 ? <span className="text-neutral-400 ml-1.5">·</span> : null}
                </span>
              ))}
            </div>
            <span className="absolute right-4 bottom-4 font-mono text-[10px] text-neutral-500 group-hover:text-neutral-900 transition">
              expand →
            </span>
          </motion.button>
        );})}
      </div>
    </section>
  );
}
