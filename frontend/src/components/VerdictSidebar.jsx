import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function VerdictSidebar({ focusNode }) {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [summary, setSummary] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/profile/summary`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  const runVerdict = async (focus) => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setText("");
    setStreaming(true);
    const params = new URLSearchParams();
    if (focus) params.set("focus_node", focus);
    try {
      const res = await fetch(`${BACKEND_URL}/api/verdict/stream?${params}`, { signal: ctrl.signal });
      if (!res.ok || !res.body) throw new Error("stream failed");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setText((prev) => prev + dec.decode(value, { stream: true }));
      }
    } catch (e) {
      if (e.name !== "AbortError") setText((p) => p + "\n[engine offline]");
    } finally {
      setStreaming(false);
    }
  };

  useEffect(() => {
    runVerdict(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (focusNode?.label) runVerdict(focusNode.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNode?.id]);

  return (
    <aside
      data-testid="verdict-sidebar"
      className="glass rounded-2xl p-5 lg:p-6 flex flex-col gap-5"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-neutral-600 uppercase">
            Live Verdict Engine
          </span>
        </div>
        <span className="font-mono text-[10px] text-neutral-400">v2.6 · claude-sonnet</span>
      </header>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            Synthetic Self Score
          </span>
          <span className="font-display text-5xl leading-none" data-testid="self-score">
            {summary?.synthetic_self_score ?? 87}
          </span>
        </div>
        <div className="h-1.5 mt-3 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${summary?.synthetic_self_score ?? 87}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full"
            style={{ background: "linear-gradient(90deg,#F4D8E0,#D4EFE1)" }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="chip" style={{ background: "#F4D8E0" }}>
            <span className="dot pink" /> {summary?.classification ?? "Emerging Multi-Domain AI Practitioner"}
          </span>
          <span className="font-mono text-[10px] text-neutral-500">
            conf · {summary?.confidence ?? "HIGH"}
          </span>
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-2">
          Cluster Distribution
        </div>
        <div className="space-y-2">
          {(summary?.clusters || []).map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="font-mono text-[11px] w-28 text-neutral-700">{c.name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.weight * 2.4}%` }}
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
              <span className="font-mono text-[10px] text-neutral-500 w-8 text-right">{c.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[180px]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            Verdict Stream {focusNode?.label ? `· ${focusNode.label}` : ""}
          </span>
          <button
            data-reticle="hover"
            data-testid="regenerate-verdict"
            onClick={() => runVerdict(focusNode?.label)}
            disabled={streaming}
            className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 hover:text-black disabled:opacity-40 transition"
          >
            {streaming ? "analyzing…" : "↻ rerun"}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={focusNode?.id || "global"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`font-mono text-[12px] leading-[1.7] text-neutral-800 whitespace-pre-wrap ${streaming ? "caret" : ""}`}
            data-testid="verdict-text"
          >
            {text || "initializing dossier · running multi-signal fusion …"}
          </motion.p>
        </AnimatePresence>
      </div>
    </aside>
  );
}
