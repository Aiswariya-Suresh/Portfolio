import { useState } from "react";
import { Send } from "lucide-react";
import { toast, Toaster } from "sonner";
import { PROFILE } from "@/data/profile";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Query submitted · analysis logged");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Submission failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className="px-6 sm:px-10 lg:px-16 py-16"
      id="contact"
      data-testid="contact-section"
    >
      <Toaster position="bottom-right" />
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-3">
            Query · Submit Analysis Request
          </div>
          <h3 className="font-display text-5xl sm:text-6xl leading-[1.02] tracking-tight text-neutral-900">
            Want to build something <em className="not-italic" style={{ background: "#F4D8E0", padding: "0 6px" }}>that thinks</em>?
          </h3>
          <p className="mt-5 text-neutral-700 max-w-md leading-relaxed">
            Open to AI/NLP collaborations, agentic-system experiments, full-stack builds, and freelance engagements. Tell me what you&apos;re trying to detect, build, or scale.
          </p>
          <div className="mt-8 space-y-2 font-mono text-[12px] text-neutral-700">
            <div><span className="text-neutral-400 mr-2">email</span>{PROFILE.email}</div>
            <div><span className="text-neutral-400 mr-2">loc</span>{PROFILE.location}</div>
            <div><span className="text-neutral-400 mr-2">edu</span>{PROFILE.education.degree} · CGPA {PROFILE.education.cgpa}</div>
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-3 glass rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">Name</label>
              <input
                data-testid="contact-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 outline-none py-2 text-neutral-900"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">Email</label>
              <input
                data-testid="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 outline-none py-2 text-neutral-900"
              />
            </div>
          </div>
          <div>
            <label className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">Query</label>
            <textarea
              data-testid="contact-message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 outline-none py-2 text-neutral-900 resize-none"
              placeholder="Describe the problem, dataset, or system you'd like to build…"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[10px] text-neutral-500">
              {sending ? "transmitting…" : "ready · all fields required"}
            </span>
            <button
              data-testid="contact-submit"
              data-reticle="hover"
              type="submit"
              disabled={sending}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition disabled:opacity-50"
            >
              Submit query <Send size={14} className="group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
