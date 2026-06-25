import { useEffect, useRef, useState, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { forceCollide } from "d3-force";
import { NODES, LINKS, CATEGORIES } from "@/data/profile";

export default function NetworkGraph({ onNodeHover, onNodeSelect, highlightId }) {
  const fgRef = useRef();
  const containerRef = useRef();
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [hoverId, setHoverId] = useState(null);

  const data = useMemo(() => ({
    nodes: NODES.map((n) => ({ ...n })),
    links: LINKS.map((l) => ({ ...l })),
  }), []);

  // Determine which nodes are "primary" (always labelled)
  const primaryIds = useMemo(() => new Set(
    NODES.filter((n) => n.kind === "hub" || n.kind === "project" || n.kind === "role" || n.kind === "research")
      .map((n) => n.id)
  ), []);

  // Neighbor index for highlight dimming
  const neighborMap = useMemo(() => {
    const m = new Map();
    LINKS.forEach((l) => {
      const s = typeof l.source === "object" ? l.source.id : l.source;
      const t = typeof l.target === "object" ? l.target.id : l.target;
      if (!m.has(s)) m.set(s, new Set());
      if (!m.has(t)) m.set(t, new Set());
      m.get(s).add(t);
      m.get(t).add(s);
    });
    return m;
  }, []);

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
    fg.d3Force("charge").strength(-340).distanceMax(420);
    fg.d3Force("link").distance((l) => {
      const src = typeof l.source === "object" ? l.source.id : l.source;
      const tgt = typeof l.target === "object" ? l.target.id : l.target;
      if (src === "self" || tgt === "self") return 150;
      return 95;
    }).strength(0.35);
    fg.d3Force("collide", forceCollide().radius((n) => {
      const r = Math.max(6, n.weight / 1.6);
      return r + 16; // generous padding to avoid label overlap
    }).strength(0.95).iterations(2));
    setTimeout(() => fg.zoomToFit(700, 80), 500);
  }, [data]);

  const effectiveHighlight = highlightId || hoverId;

  return (
    <div ref={containerRef} className="w-full h-full relative" data-testid="network-graph">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        cooldownTicks={200}
        d3VelocityDecay={0.32}
        nodeRelSize={6}
        linkColor={(l) => {
          const s = typeof l.source === "object" ? l.source.id : l.source;
          const t = typeof l.target === "object" ? l.target.id : l.target;
          if (effectiveHighlight && (s === effectiveHighlight || t === effectiveHighlight)) {
            return "rgba(26,26,26,0.35)";
          }
          return "rgba(26,26,26,0.06)";
        }}
        linkWidth={(l) => {
          const s = typeof l.source === "object" ? l.source.id : l.source;
          const t = typeof l.target === "object" ? l.target.id : l.target;
          if (effectiveHighlight && (s === effectiveHighlight || t === effectiveHighlight)) return 1.2;
          return 0.5;
        }}
        onNodeHover={(node) => {
          setHoverId(node?.id || null);
          if (onNodeHover) onNodeHover(node || null);
          if (containerRef.current) {
            containerRef.current.style.cursor = node ? "pointer" : "default";
          }
          // Drive the global crosshair reticle to "lock on" to the hovered node.
          if (node && fgRef.current) {
            const zoom = fgRef.current.zoom() || 1;
            const r = Math.max(4, node.weight / 1.6);
            // halo padding (+6) + small extra margin so the reticle ring sits just outside the node
            const screenDiameter = (r + 8) * 2 * zoom;
            const size = Math.max(34, Math.min(180, screenDiameter));
            window.dispatchEvent(
              new CustomEvent("reticle:lock", { detail: { size } })
            );
          } else {
            window.dispatchEvent(new CustomEvent("reticle:lock", { detail: { size: null } }));
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
          const isHub = node.kind === "hub";
          const r = Math.max(4, node.weight / 1.6);

          const isHighlighted = effectiveHighlight === node.id;
          const isNeighbor = effectiveHighlight && neighborMap.get(effectiveHighlight)?.has(node.id);
          const dim = effectiveHighlight && !isHighlighted && !isNeighbor;

          // halo
          if (isHighlighted || isHub) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, r + 6, 0, 2 * Math.PI, false);
            ctx.fillStyle = (cat.color || "#F4D8E0") + "55";
            ctx.fill();
          } else if (!dim) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, r + 2.5, 0, 2 * Math.PI, false);
            ctx.fillStyle = (cat.color || "#F4D8E0") + "40";
            ctx.fill();
          }

          // body
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fillStyle = isHub ? "#1A1A1A" : (dim ? "#EFEDE8" : cat.color);
          ctx.fill();
          ctx.lineWidth = isHub ? 1.5 : 0.8;
          ctx.strokeStyle = dim ? "rgba(0,0,0,0.06)" : "rgba(26,26,26,0.32)";
          ctx.stroke();

          // Hub inner label
          if (isHub) {
            ctx.fillStyle = "#FAF9F6";
            ctx.font = `600 ${Math.max(8, 9 / globalScale)}px 'IBM Plex Mono', monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("SELF", node.x, node.y);
          }

          // Label decision: only show for primary nodes OR highlighted/neighbor
          const showLabel = primaryIds.has(node.id) || isHighlighted || isNeighbor;
          if (!showLabel) return;

          const fontSize = Math.max(9, (isHighlighted ? 13 : 10.5) / globalScale);
          ctx.font = `${isHighlighted ? "600" : "400"} ${fontSize}px Manrope, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          const yOffset = r + 5;

          // soft label background for legibility
          const text = node.label;
          const textW = ctx.measureText(text).width;
          ctx.fillStyle = "rgba(250, 249, 246, 0.85)";
          ctx.fillRect(node.x - textW / 2 - 4, node.y + yOffset - 1, textW + 8, fontSize + 4);

          ctx.fillStyle = dim
            ? "rgba(0,0,0,0.25)"
            : (isHighlighted ? "#1A1A1A" : "rgba(26,26,26,0.78)");
          ctx.fillText(text, node.x, node.y + yOffset);
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          const r = Math.max(6, node.weight / 1.6) + 6;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
      />
    </div>
  );
}
