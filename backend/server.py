from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone  # noqa: E402

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---- Profile context (single source of truth for LLM) ----
PROFILE_CONTEXT = """
SUBJECT: Aiswariya S
ROLE: AI & Full-Stack Developer | LLMs, NLP, Agentic AI
EDUCATION: B.Tech Information Technology, K. Ramakrishnan College of Engineering (2024-Present), CGPA 8.22/10.
WORK: DevOps Engineer (Project-Based) at WICE since 2025, supporting a language-learning platform deployed across schools (CI/CD, monitoring, deployment uptime).
FREELANCE: Frontend + light backend builds in HTML5/CSS3/Tailwind/Java/Python, PostgreSQL.
FLAGSHIP: Echo Trace AI - HackArena 2.0 National Finalist. Team Lead (2-person team). AI-powered behavioral anomaly detection identifying coordinated synthetic amplification on social media via Sentence-BERT semantic similarity, NetworkX coordination graphs, temporal anomaly detection, VADER sentiment uniformity. Produces a Synthetic Influence Score (0-100) classifying conversations as Human / Mixed / Bot Swarm. Stack: Python, FastAPI, Sentence-BERT, HuggingFace Transformers, NetworkX, PyTorch Geometric (GNN), React.js, D3.js, Docker. Analyzed dataset of 11,000+ users from Tsinghua University.
OTHER PROJECTS: Donna (anonymous posting platform, full-stack), CRMS Campus Recruitment Management System (SQL/MySQL automation), Personalized Local Search Engine, Automated Birthday Reminder script, Responsive client portfolio website.
RESEARCH INTERESTS: Applied AI, LLMs, NLP, Agentic AI, Prompt Engineering, RAG, Semantic Search, Behavioral Anomaly Detection, AI-powered web apps.
SKILLS: Python, Java, C, HTML5, CSS3, Tailwind, PostgreSQL, SQL, MySQL, CI/CD, App Monitoring, DSA basics.
LEADERSHIP: Team Lead - Echo Trace AI; led architecture, AI pipeline integration, presentation.
GROWTH TIMELINE: 2024 foundations -> 2025 freelance + DevOps role + hackathon flagship -> 2026 emerging AI/agentic focus.
SOFT SKILLS: Communication, collaboration, client relations, analytical problem solving, adaptability.
"""

CATEGORIES = ["AI/ML", "Full-Stack", "DevOps", "Data", "Frontend", "Research", "Leadership"]

class VerdictRequest(BaseModel):
    focus_node: Optional[str] = None  # e.g. "Echo Trace AI", "DevOps cluster"
    category: Optional[str] = None

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactInput(BaseModel):
    name: str
    email: str
    message: str

@api_router.get("/")
async def root():
    return {"message": "Echo Trace Portfolio API", "subject": "Aiswariya S"}

@api_router.get("/profile/summary")
async def profile_summary():
    """Static, deterministic numeric summary used by the dashboard panels."""
    return {
        "synthetic_self_score": 87,
        "classification": "Emerging Multi-Domain AI Practitioner",
        "confidence": "HIGH",
        "clusters": [
            {"name": "AI / NLP", "weight": 38, "color": "pink"},
            {"name": "Full-Stack", "weight": 24, "color": "mint"},
            {"name": "DevOps / Infra", "weight": 18, "color": "lavender"},
            {"name": "Data / Research", "weight": 12, "color": "blue"},
            {"name": "Leadership", "weight": 8, "color": "yellow"},
        ],
        "signals": {
            "linguistic_pattern": "Project descriptions show structured problem→decision→outcome framing (rare in early-career profiles).",
            "temporal_burst": "Activity spike Q3-Q4 2025: Echo Trace AI + WICE deployment + freelance scaling.",
            "coordination_graph": "Tight 2-node collaboration on Echo Trace; otherwise high autonomy.",
            "sentiment_uniformity": "Consistent curiosity-driven tone; high consistency across self-descriptions (0.84).",
        },
        "growth_trajectory": [
            {"year": "2024", "density": 0.18, "label": "Foundations"},
            {"year": "2025 H1", "density": 0.42, "label": "Freelance + Web Dev"},
            {"year": "2025 H2", "density": 0.81, "label": "Echo Trace AI + WICE"},
            {"year": "2026", "density": 0.94, "label": "AI / Agentic Focus"},
        ],
    }

async def _verdict_stream(focus_node: Optional[str], category: Optional[str]):
    if not EMERGENT_LLM_KEY:
        yield "Live verdict engine offline. Configure EMERGENT_LLM_KEY to activate."
        return

    focus_line = ""
    if focus_node:
        focus_line = f"The viewer is currently inspecting the node: '{focus_node}'. Center the verdict around it."
    elif category:
        focus_line = f"The viewer is inspecting the cluster: '{category}'. Center the verdict around that cluster."
    else:
        focus_line = "Generate the overall career verdict."

    system_message = (
        "You are 'Echo Trace Career Engine' — a behavioral analysis dashboard that profiles a developer "
        "the same way Echo Trace AI profiles online discourse. You speak in calm, analytical, slightly "
        "literary prose. You produce structured, evidence-driven verdicts. Never hallucinate facts beyond "
        "the provided dossier. Output 3-4 short paragraphs (no markdown, no headings, no lists). "
        "Reference specific clusters, projects, or signals where relevant. Tone: thoughtful, precise, "
        "occasionally poetic — like an editorial intelligence report."
    )

    prompt = f"""DOSSIER:
{PROFILE_CONTEXT}

INSTRUCTION:
{focus_line}

Write the verdict now. Begin directly — no preamble like 'Here is the verdict'. Speak about the subject in the third person as 'the subject' or 'Aiswariya'."""

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"verdict-{uuid.uuid4()}",
        system_message=system_message,
    ).with_model("anthropic", "claude-sonnet-4-6")

    try:
        async for ev in chat.stream_message(UserMessage(text=prompt)):
            if isinstance(ev, TextDelta):
                yield ev.content
            elif isinstance(ev, StreamDone):
                break
    except Exception as e:
        logging.exception("verdict stream failed")
        yield f"\n[engine fault: {type(e).__name__}]"

@api_router.get("/verdict/stream")
async def verdict_stream(focus_node: Optional[str] = None, category: Optional[str] = None):
    async def gen():
        async for chunk in _verdict_stream(focus_node, category):
            yield chunk
    return StreamingResponse(
        gen(),
        media_type="text/plain; charset=utf-8",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@api_router.post("/contact")
async def submit_contact(payload: ContactInput):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    return {"ok": True, "id": msg.id}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
