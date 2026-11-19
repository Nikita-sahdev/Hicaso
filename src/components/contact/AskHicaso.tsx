"use client";

import { useState, type FormEvent } from "react";

type Turn = { role: "user" | "assistant"; content: string };

// questions the site's FAQs answer, one tap each
const STARTERS = ["Will you sign an NDA?", "Which hours do you work?", "Can you work on my existing app?"];

// "Ask Hicaso": a short chat with the site assistant (/api/assistant). Plain kit markup; the log is a live region.
export default function AskHicaso() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function ask(question: string) {
    const q = question.trim();
    if (!q || pending) return;
    const next: Turn[] = [...turns, { role: "user", content: q }];
    setTurns(next);
    setText("");
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (res.ok && data.reply) setTurns([...next, { role: "assistant", content: data.reply }]);
      else setError(data.error || "No answer came back. Use the form above or write to hello@hicaso.com.");
    } catch {
      setError("No answer came back: check your connection, or use the form above.");
    } finally {
      setPending(false);
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(text);
  };

  return (
    <div className="card ask">
      <ol className="ask__log" aria-live="polite" aria-busy={pending}>
        {turns.map((t, i) => (
          <li key={i} className={`ask__msg ask__msg--${t.role}`}>
            <span className="sr-only">{t.role === "user" ? "You:" : "Hicaso assistant:"}</span>
            {t.content}
          </li>
        ))}
        {pending ? <li className="ask__msg ask__msg--assistant muted">Looking at the site…</li> : null}
      </ol>
      {turns.length === 0 ? (
        <div className="ask__starters">
          {STARTERS.map((s) => (
            <button key={s} type="button" className="btn btn--secondary" onClick={() => void ask(s)}>
              {s}
            </button>
          ))}
        </div>
      ) : null}
      {error ? <p className="ask__error" role="alert">{error}</p> : null}
      <form className="ask__form" onSubmit={submit}>
        <label className="sr-only" htmlFor="ask-q">Your question</label>
        <input
          id="ask-q"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={600}
          placeholder="Ask about Hicaso"
          autoComplete="off"
        />
        <button type="submit" className="btn btn--primary" disabled={pending || !text.trim()}>
          Ask
        </button>
      </form>
      <p className="t-small muted">An AI assistant answers from this website only. For prices and timelines, send the enquiry form.</p>
    </div>
  );
}
