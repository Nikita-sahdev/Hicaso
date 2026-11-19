"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, App, Button, DatePicker, Flex, Form, Input, Select, Space, Tag, Upload } from "antd";
import type { TextAreaRef } from "antd/es/input/TextArea";
import type { Dayjs } from "dayjs";
import { CATEGORIES, IMAGE_ALT_PLACEHOLDER, publishProblems, type PostFields, type Problem } from "@/lib/blog/post";
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
  const [when, setWhen] = useState<Dayjs | null>(null);
  const [server, setServer] = useState<Problem[]>([]);
  // "Saved.", "Published." and the confirms come from antd's App context (AdminShell)
  const { message, modal } = App.useApp();
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const [pending, start] = useTransition();
  const bodyRef = useRef<TextAreaRef>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      const r = await uploadImageAction(fd);
      if (!r.ok) return setUploadError(r.error);
      const md = `![${IMAGE_ALT_PLACEHOLDER}](${r.path})`;
      const at = bodyRef.current?.resizableTextArea?.textArea.selectionStart;
      setF((s) => {
        const i = typeof at === "number" ? Math.min(at, s.body.length) : s.body.length;
        return { ...s, body: s.body.slice(0, i) + md + s.body.slice(i) };
      });
    } catch {
      setUploadError("The upload failed. Try again.");
    } finally {
      setUploading(false);
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
  };
  const live = publishProblems(f);
  const published = meta.status === "published";
  const scheduled = published && meta.publishAt !== null && new Date(meta.publishAt).getTime() > now;
  const state = !published ? "Draft" : scheduled ? "Scheduled" : "Live";
  const stateColor = { Draft: "default", Scheduled: "gold", Live: "green" }[state];

  const apply = (r: SaveResult, done: string) => {
    setNow(Date.now());
    if (r.ok) {
      setServer([]);
      setMeta({ status: r.post.status, slugLocked: r.post.slugLocked, publishAt: r.post.publishAt ? new Date(r.post.publishAt).toISOString() : null });
      setF((s) => ({ ...s, slug: r.post.slug }));
      setSaved(pick(r.post));
      setServerAt(new Date(r.post.updatedAt).toISOString());
      clearBackup();
      if (done) message.success(done);
    } else {
      setServer(r.problems);
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
    const d = when.toDate();
    if (Number.isNaN(d.getTime())) return setServer([{ field: "publishAt", message: "Pick a valid date and time." }]);
    run(() => publishPostAction(post.id, f, d.toISOString()), "Scheduled.");
  };

  // a server problem shows under its field, in the field's error state
  const fi = (field: Problem["field"]) => {
    const msgs = server.filter((p) => p.field === field).map((p) => p.message);
    return msgs.length ? { validateStatus: "error" as const, help: <span role="alert">{msgs.join(" ")}</span> } : {};
  };
  const leave = (e: React.MouseEvent) => {
    if (!dirty) return;
    e.preventDefault();
    modal.confirm({ title: "Leave without saving?", content: "Your changes will be lost.", okText: "Leave", okType: "danger", onOk: () => router.push("/admin/blog") });
  };

  return (
    <>
      {offer ? (
        <Alert
          type="info"
          showIcon
          role="status"
          style={{ marginBottom: 16, maxWidth: "48rem" }}
          title={`You have unsaved changes from ${new Date(offer.backup.savedAt).toLocaleString()}.`}
          description={`${offer.savedSince ? "The post was saved since then, so restoring will replace the newer text. " : ""}Restore them?`}
          action={
            <Flex gap={8} vertical>
              <Button
                type="primary"
                onClick={() => {
                  const b = offer.backup.fields;
                  setF(post.slugLocked ? { ...b, slug: saved.slug } : b);
                  setOffer(null);
                }}
              >
                Restore
              </Button>
              <Button
                onClick={() => {
                  clearBackup();
                  setOffer(null);
                }}
              >
                Discard
              </Button>
            </Flex>
          }
        />
      ) : null}
      <p>
        <a href="/admin/blog" onClick={leave}>
          All posts
        </a>
      </p>
      <h1>Edit post</h1>
      <p>
        <Tag color={stateColor}>{state}</Tag>
        {published && meta.publishAt ? <LocalTime iso={meta.publishAt} /> : null}
      </p>

      <Form layout="vertical" component="div" style={{ maxWidth: "48rem" }}>
        <Form.Item label="Headline" htmlFor="pf-headline" {...fi("headline")}>
          <Input id="pf-headline" value={f.headline} onChange={set("headline")} maxLength={200} />
        </Form.Item>
        <Form.Item
          label="Address (slug)"
          htmlFor="pf-slug"
          extra={meta.slugLocked ? "The address is locked because the post has been published." : undefined}
          {...fi("slug")}
        >
          <Space.Compact block>
            <Space.Addon>/blog/</Space.Addon>
            <Input id="pf-slug" value={f.slug} onChange={set("slug")} readOnly={meta.slugLocked} maxLength={80} />
          </Space.Compact>
        </Form.Item>
        <Form.Item label="SEO title" htmlFor="pf-seo" {...fi("seoTitle")}>
          <Input id="pf-seo" value={f.seoTitle} onChange={set("seoTitle")} maxLength={200} />
        </Form.Item>
        <Form.Item label="Description" htmlFor="pf-desc" extra="50 to 160 characters to publish." {...fi("description")}>
          <Input.TextArea id="pf-desc" value={f.description} onChange={set("description")} rows={3} showCount />
        </Form.Item>
        <Form.Item label="Category" htmlFor="pf-cat" {...fi("category")}>
          <Select
            id="pf-cat"
            value={f.category || undefined}
            placeholder="Choose…"
            onChange={(v: string) => set("category")({ target: { value: v ?? "" } })}
            allowClear
            options={CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
          />
        </Form.Item>
      </Form>

      <div className={css.body}>
        <Form layout="vertical" component="div">
          <Form.Item label="Body (Markdown)" htmlFor="pf-body" {...fi("body")}>
            <Input.TextArea id="pf-body" ref={bodyRef} value={f.body} onChange={set("body")} rows={24} />
          </Form.Item>
          <Upload
            accept="image/png,image/jpeg"
            showUploadList={false}
            disabled={uploading}
            customRequest={({ file }) => void upload(file as File)}
          >
            <Button loading={uploading}>Add an image (PNG or JPEG, up to 3 MB)</Button>
          </Upload>
          {uploadError ? <Alert type="error" showIcon role="alert" title={uploadError} style={{ marginTop: 12 }} /> : null}
        </Form>
        <div>
          <p>Preview</p>
          <div className={css.preview} data-preview dangerouslySetInnerHTML={{ __html: renderMarkdown(f.body) }} />
        </div>
      </div>

      {live.length > 0 ? (
        <Alert
          type="warning"
          showIcon
          style={{ maxWidth: "48rem", marginBottom: 16 }}
          title="Needed before publishing"
          description={
            <ul aria-label="Needed before publishing" style={{ margin: 0, paddingLeft: 18 }}>
              {live.map((p, i) => (
                <li key={i}>{p.message}</li>
              ))}
            </ul>
          }
        />
      ) : null}

      <Flex gap={12} wrap align="center" style={{ margin: "16px 0" }}>
        <Button type="primary" loading={pending} onClick={() => run(() => savePostAction(post.id, f), "Saved.")}>
          {published ? "Save" : "Save draft"}
        </Button>
        {!published || scheduled ? (
          <Button disabled={pending || live.length > 0} onClick={() => run(() => publishPostAction(post.id, f), "Published.")}>
            Publish now
          </Button>
        ) : null}
        {!published || scheduled ? (
          <Flex gap={8} wrap align="center">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="D MMM YYYY, HH:mm"
              placeholder="Schedule for"
              aria-label="Schedule for"
              value={when}
              onChange={setWhen}
              status={fi("publishAt").validateStatus}
            />
            <Button disabled={pending || live.length > 0} onClick={schedule}>
              Schedule
            </Button>
          </Flex>
        ) : null}
        {published ? (
          <Button disabled={pending} onClick={() => run(() => unpublishPostAction(post.id), "Unpublished.")}>
            Unpublish
          </Button>
        ) : null}
        <Button
          danger
          disabled={pending}
          onClick={() =>
            modal.confirm({
              title: "Delete this post for good?",
              okText: "Delete",
              okType: "danger",
              onOk: () =>
                start(async () => {
                  clearBackup();
                  apply(await deletePostAction(post.id), "");
                }),
            })
          }
        >
          Delete
        </Button>
      </Flex>
      {fi("publishAt").help ?? null}
    </>
  );
}
