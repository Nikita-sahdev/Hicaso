"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CATEGORIES, publishProblems, type PostFields, type Problem } from "@/lib/blog/post";
import { renderMarkdown } from "@/lib/blog/markdown";
import { deletePostAction, publishPostAction, savePostAction, unpublishPostAction, uploadImageAction } from "../actions";
import type { SaveResult } from "@/lib/blog/store";
import LocalTime from "../LocalTime";
import { backupKey, backupOffer, isDirty, type Backup } from "./draftBackup";
import css from "./editor.module.css";

type EditorPost = PostFields & {
  id: string;
  status: "draft" | "published";
  slugLocked: boolean;
  publishAt: string | null;
  updatedAt: string;
};

export default function Editor({ post }: { post: EditorPost }) {
  const pick = (p: PostFields): PostFields => ({
    slug: p.slug,
    headline: p.headline,
    seoTitle: p.seoTitle,
    description: p.description,
    category: p.category,
    body: p.body,
  });
  const [f, setF] = useState<PostFields>(() => pick(post));
  // The last saved (or server-loaded) copy: `dirty` is f compared with it.
  const [saved, setSaved] = useState<PostFields>(() => pick(post));
  const [serverAt, setServerAt] = useState(post.updatedAt);
  const [offer, setOffer] = useState<{ backup: Backup; savedSince: boolean } | null>(null);
  const dirty = isDirty(f, saved);
  const [meta, setMeta] = useState({ status: post.status, slugLocked: post.slugLocked, publishAt: post.publishAt });
  const [when, setWhen] = useState("");
  const [server, setServer] = useState<Problem[]>([]);
  const [note, setNote] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [pending, start] = useTransition();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const upload = async (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      const r = await uploadImageAction(fd);
      if (!r.ok) return setUploadError(r.error);
      const md = `![Describe the image](${r.path})`;
      const at = bodyRef.current?.selectionStart;
      setF((s) => {
        const i = typeof at === "number" ? Math.min(at, s.body.length) : s.body.length;
        return { ...s, body: s.body.slice(0, i) + md + s.body.slice(i) };
      });
      setNote("");
    } catch {
      setUploadError("The upload failed. Try again.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const readBackup = (): Backup | null => {
    try {
      const raw = localStorage.getItem(backupKey(post.id));
      return raw ? (JSON.parse(raw) as Backup) : null;
    } catch {
      return null;
    }
  };
  const writeBackup = () => {
    try {
      const b: Backup = { fields: f, savedAt: Date.now(), serverUpdatedAt: serverAt };
      localStorage.setItem(backupKey(post.id), JSON.stringify(b));
    } catch {}
  };
  const clearBackup = () => {
    try {
      localStorage.removeItem(backupKey(post.id));
    } catch {}
  };

  // On mount: offer a backup that differs from the server copy.
  useEffect(() => {
    const t = setTimeout(() => {
      const b = readBackup();
      const o = backupOffer(b, saved, serverAt);
      if (b && o) setOffer({ backup: b, ...o });
      else if (b) clearBackup();
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the backup current while dirty (debounced). Saves clear it. Hold off while a restore
  // offer is waiting (or has not been looked up yet: not dirty), so the old backup survives.
  useEffect(() => {
    if (offer || !dirty) return;
    const t = setTimeout(writeBackup, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f, saved, offer]);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const set = (k: keyof PostFields) => (e: { target: { value: string } }) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
    setNote("");
  };
  const live = publishProblems(f);
  const published = meta.status === "published";
  const scheduled = published && meta.publishAt !== null && new Date(meta.publishAt).getTime() > now;
  const state = !published ? "Draft" : scheduled ? "Scheduled" : "Live";

  const apply = (r: SaveResult, done: string) => {
    setNow(Date.now());
    if (r.ok) {
      setServer([]);
      setMeta({ status: r.post.status, slugLocked: r.post.slugLocked, publishAt: r.post.publishAt ? new Date(r.post.publishAt).toISOString() : null });
      setF((s) => ({ ...s, slug: r.post.slug }));
      setSaved(pick(r.post));
      setServerAt(new Date(r.post.updatedAt).toISOString());
      clearBackup();
      setNote(done);
    } else {
      setServer(r.problems);
      setNote("");
    }
  };
  const run = (fn: () => Promise<SaveResult>, done: string) =>
    start(async () => {
      // An ended session makes the action redirect to the login page; keep the text safe first.
      if (dirty) writeBackup();
      apply(await fn(), done);
    });

  const schedule = () => {
    if (!when) return setServer([{ field: "publishAt", message: "Pick a date and time." }]);
    const d = new Date(when);
    if (Number.isNaN(d.getTime())) return setServer([{ field: "publishAt", message: "Pick a valid date and time." }]);
    run(() => publishPostAction(post.id, f, d.toISOString()), "Scheduled.");
  };

  const err = (field: Problem["field"]) =>
    server.filter((p) => p.field === field).map((p, i) => (
      <p key={i} role="alert" className={css.err}>
        {p.message}
      </p>
    ));

  return (
    <>
      {offer ? (
        <div role="status" className={css.restore}>
          <p>
            You have unsaved changes from {new Date(offer.backup.savedAt).toLocaleString()}.
            {offer.savedSince ? " The post was saved since then, so restoring will replace the newer text." : ""} Restore them?
          </p>
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => {
              const b = offer.backup.fields;
              setF(post.slugLocked ? { ...b, slug: saved.slug } : b);
              setOffer(null);
            }}
          >
            Restore
          </button>{" "}
          <button
            className="btn"
            type="button"
            onClick={() => {
              clearBackup();
              setOffer(null);
            }}
          >
            Discard
          </button>
        </div>
      ) : null}
      <p>
        <a
          href="/admin/blog"
          onClick={(e) => {
            if (dirty && !confirm("Leave without saving? Your changes will be lost.")) e.preventDefault();
          }}
        >
          All posts
        </a>
      </p>
      <h1>Edit post</h1>
      <p>
        State: <strong>{state}</strong>
        {published && meta.publishAt ? (
          <>
            {" "}
            · <LocalTime iso={meta.publishAt} />
          </>
        ) : null}
      </p>

      <div className={css.fields}>
        <label>
          Headline
          <input value={f.headline} onChange={set("headline")} maxLength={200} />
        </label>
        {err("headline")}
        <label>
          Address (slug)
          <input value={f.slug} onChange={set("slug")} readOnly={meta.slugLocked} maxLength={80} />
        </label>
        {meta.slugLocked ? <small>The address is locked because the post has been published.</small> : null}
        {err("slug")}
        <label>
          SEO title
          <input value={f.seoTitle} onChange={set("seoTitle")} maxLength={200} />
        </label>
        {err("seoTitle")}
        <label>
          Description ({f.description.length} characters; 50 to 160 to publish)
          <textarea value={f.description} onChange={set("description")} rows={3} />
        </label>
        {err("description")}
        <label>
          Category
          <select value={f.category} onChange={set("category")}>
            <option value="">Choose…</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        {err("category")}
      </div>

      <div className={css.body}>
        <label>
          Body (Markdown)
          <textarea ref={bodyRef} value={f.body} onChange={set("body")} rows={24} />
        </label>
        <div>
          <p>Preview</p>
          <div className={css.preview} data-preview dangerouslySetInnerHTML={{ __html: renderMarkdown(f.body) }} />
        </div>
      </div>
      <p>
        <label>
          Add an image (PNG or JPEG, up to 3 MB)
          <input type="file" accept="image/png,image/jpeg" disabled={uploading} onChange={(e) => upload(e.currentTarget)} />
        </label>
        {uploading ? " Uploading…" : null}
      </p>
      {uploadError ? (
        <p role="alert" className={css.err}>
          {uploadError}
        </p>
      ) : null}
      {err("body")}

      {live.length > 0 ? (
        <ul aria-label="Needed before publishing">
          {live.map((p, i) => (
            <li key={i}>{p.message}</li>
          ))}
        </ul>
      ) : null}

      <div className={css.actions}>
        <button className="btn btn--primary" type="button" disabled={pending} onClick={() => run(() => savePostAction(post.id, f), "Saved.")}>
          {published ? "Save" : "Save draft"}
        </button>
        {!published || scheduled ? (
          <button className="btn" type="button" disabled={pending || live.length > 0} onClick={() => run(() => publishPostAction(post.id, f), "Published.")}>
            Publish now
          </button>
        ) : null}
        {!published || scheduled ? (
          <span className={css.schedule}>
            <label>
              Schedule for
              <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
            </label>
            <button className="btn" type="button" disabled={pending || live.length > 0} onClick={schedule}>
              Schedule
            </button>
          </span>
        ) : null}
        {published ? (
          <button
            className="btn"
            type="button"
            disabled={pending}
            onClick={() => run(() => unpublishPostAction(post.id), "Unpublished.")}
          >
            Unpublish
          </button>
        ) : null}
        <button
          className="btn"
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this post for good?"))
              start(async () => {
                clearBackup();
                apply(await deletePostAction(post.id), "");
              });
          }}
        >
          Delete
        </button>
      </div>
      {err("publishAt")}
      {note ? <p role="status">{note}</p> : null}
    </>
  );
}
