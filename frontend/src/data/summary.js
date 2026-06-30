// Static profile summary — replaces the previous GET /api/profile/summary call.
// All numbers and labels are curated; nothing here is fetched at runtime.
export const PROFILE_SUMMARY = {
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
  signals: {
    linguistic_pattern: "Project descriptions show structured problem→decision→outcome framing.",
    temporal_burst: "Activity spike Q3-Q4 2025: Echo Trace AI + WICE + freelance scaling.",
    coordination_graph: "Tight 2-node collaboration on Echo Trace; otherwise high autonomy.",
    sentiment_uniformity: "Consistent curiosity-driven tone (0.84).",
  },
  growth_trajectory: [
    { year: "2024", density: 0.18, label: "Foundations" },
    { year: "2025 H1", density: 0.42, label: "Freelance + Web Dev" },
    { year: "2025 H2", density: 0.81, label: "Echo Trace AI + WICE" },
    { year: "2026", density: 0.94, label: "AI / Agentic Focus" },
  ],
};
