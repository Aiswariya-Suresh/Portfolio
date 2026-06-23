import { useEffect, useRef, useState, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { NODES, LINKS, CATEGORIES } from "@/data/profile";

export default function NetworkGraph({ onNodeHover, onNodeSelect, highlightId }) {
  const fgRef = useRef();
  const containerRef = useRef();
  const [size, setSize] = useState({ w: 800, h: 560 });

  const data = useMemo(() => ({
    nodes: NODES.map((n) => ({ ...n })),
    links: LINKS.map((l) => ({ ...l })),
  }), []);

  useEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setSize({ w: Math.max(320, r.width), h: Math.max(420, r.height) });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!fgRef.current) return;
    const fg = fgRef.current;
    fg.d3Force("charge").strength(-160);
    fg.d3Force("link").distance((l) => {
      const src = typeof l.source === "object" ? l.source.id : l.source;
      if (src === "self") return 110;
      return 70;
    });
    setTimeout(() => fg.zoomToFit(600, 60), 400);
  }, [data]);

  return (
    <div ref={containerRef} className="w-full h-full relative" data-testid="network-graph">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        cooldownTicks={140}
        nodeRelSize={6}
        linkColor={() => "rgba(26,26,26,0.10)"}
        linkWidth={(l) => {
          const src = typeof l.source === "object" ? l.source.id : l.source;
          const tgt = typeof l.target === "object" ? l.target.id : l.target;
          if (highlightId && (src === highlightId || tgt === highlightId)) return 1.6;
          return 0.6;
        }}
        onNodeHover={(node) => {
          if (onNodeHover) onNodeHover(node || null);
          if (containerRef.current) {
            containerRef.current.style.cursor = node ? "pointer" : "default";
          }
        }}
        onNodeClick={(node) => {
          if (onNodeSelect) onNodeSelect(node);
          if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 600);
            fgRef.current.zoom(2.2, 600);
          }
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const cat = CATEGORIES[node.category] || CATEGORIES.fullstack;
          const r = Math.max(4, node.weight / 1.6);
          const isHub = node.kind === "hub";
          const dim = highlightId && node.id !== highlightId &&
            !LINKS.some((l) => {
              const s = typeof l.source === "object" ? l.source.id : l.source;
              const t = typeof l.target === "object" ? l.target.id : l.target;
              return (s === highlightId && t === node.id) || (t === highlightId && s === node.id);
            });

          // outer halo
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = dim ? "rgba(0,0,0,0.02)" : cat.color + "66";
          ctx.fill();

          // body
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fillStyle = isHub ? "#1A1A1A" : (dim ? "#EFEDE8" : cat.color);
          ctx.fill();
          ctx.lineWidth = isHub ? 1.5 : 0.8;
          ctx.strokeStyle = dim ? "rgba(0,0,0,0.08)" : "rgba(26,26,26,0.35)";
          ctx.stroke();

          // label
          const fontSize = Math.max(9, 11 / globalScale);
          ctx.font = `${fontSize}px Manrope, system-ui, sans-serif`;
          ctx.fillStyle = dim ? "rgba(0,0,0,0.25)" : (isHub ? "#1A1A1A" : "rgba(26,26,26,0.85)");
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          const yOffset = r + 4;
          ctx.fillText(node.label, node.x, node.y + yOffset);

          if (isHub) {
            ctx.fillStyle = "#FAF9F6";
            ctx.font = `600 ${Math.max(8, 9 / globalScale)}px 'IBM Plex Mono', monospace`;
            ctx.textBaseline = "middle";
            ctx.fillText("SELF", node.x, node.y);
          }
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          const r = Math.max(6, node.weight / 1.6) + 4;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
      />
    </div>
  );
}
