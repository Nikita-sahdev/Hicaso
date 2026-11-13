# Hicaso Blog and Admin Panel: Design

**Date:** 2026-11-13
**Branch:** `feat/blog-admin`, cut from `feat/services-studio` (owner's choice: `main` still has the old blue site)
**Supersedes:** Task 10 ("Blog", posts in a TS data file) of `docs/superpowers/plans/2026-11-13-competitor-gap-closure.md`. Posts now come from the admin panel instead. The older specs (2026-10-11, 2026-11-05) list a blog only as out of scope.

## Why

The competitor audit found a blog on 19 of 19 peer sites and none on hicaso.com. Cost guides and how-to posts are how peers pull in search traffic. The owner wants to write and publish posts without a developer or a deploy. That means an admin panel in the same model as BillMinute's (`~/invoice-app`, branch `blog-admin`): a custom admin, posts in a database, written in Markdown.

## Goals

1. A private admin panel at `hicaso.com/admin`. Only the owner can sign in.
2. The owner writes posts in Markdown with a live preview, saves drafts, publishes now or schedules a date, unpublishes and deletes.
3. A public blog at `/blog` and `/blog/<slug>` in the current site design, live as soon as a post is published.
4. Posts help search: an SEO title and description, Article JSON-LD, the sitemap and `llms.txt`.

## Non-goals

- No other users, roles or approval flow. One account, the owner's (owner: "its just me").
- No sign-up page, password-reset email, comments, newsletter, tags beyond one category, or post revision history.
- No managing other site content (enquiries, case studies) in this version. The admin is built so more sections can be added later, but none are built now.
- No rich-text (Word-style) editor (owner: "markdown like billminute").
- No static export or cron-based rebuild. Unlike billminute.com, hicaso.com runs as a live Node server (`next start`).

## Anti-goals (a failure even if it works)

- Anyone other than the owner can reach `/admin` pages or admin APIs, or the login can be brute-forced.
- A post body can inject script into the public site (Markdown must not pass raw HTML through).
- A published post's URL changes after it went live.
- The blog shows empty, broken or half-written pages. Drafts and future-scheduled posts must never be visible, and the blog's nav, footer and sitemap entries only appear once a post is live.
- The public pages fail the site's existing gates (tasteskill gate, copy-lint, `npm run smoke`).

## Decided by the owner

- **The base is `feat/services-studio`**, not `main`.
- **The database is Postgres**, its own database for the Hicaso app, not BillMinute's MongoDB or API.
- **One user (the owner), with drafts.**
- **Posts are written in Markdown**, like BillMinute.
- **Hosting:** the same server as BillMinute. hicaso.com already runs there as a Node server. Whether Postgres is installed there is unknown, so the deploy notes must cover installing it.

## The post (modelled on BillMinute's `blogPost`)

| Field | Rule |
|---|---|
| `headline` | Required, at most 200 characters. The page's h1. A post is created from its headline. |
| `slug` | Generated from the headline (`slugify`, `^[a-z0-9]+(-[a-z0-9]+)*$`) and unique. Editable while a draft. **Locked for ever** once the post is first published or scheduled (`slug_locked`), as in BillMinute. |
| `seo_title` | Optional. Falls back to the headline in `<title>`. |
| `description` | Required to publish, 50–160 characters (search snippet and meta description). |
| `category` | Required to publish. One of a fixed list in code. **Builder's call, owner to confirm:** `ai`, `mobile`, `web`, `cost-guides` (AI, Mobile, Web, Cost guides, matching the services). |
| `body` | Markdown. Required to publish. |
| `status` | `draft` or `published`. |
| `publish_at` | Null for drafts. For a published post, the time it becomes visible. In the future means **scheduled**. |
| `created_at`, `updated_at` | Timestamps. |

The admin shows three states: **Draft**, **Scheduled** (published with a future `publish_at`) and **Live** (published with `publish_at <= now`). The public site shows only live posts, so a scheduled post appears on its own when its time comes, with no job or cron.

**Checks before publishing** (shown in the editor; publishing is refused while any fails): description present and 50–160 characters, category set, body not empty, slug valid and unique. Scheduling only accepts a future time.

## Admin panel

- **Sign in:** `/admin/login`, with email and password. The account is created once from the command line by a seed script (no sign-up route). Failed logins are rate-limited. The session is an HTTP-only, Secure, SameSite cookie. Every `/admin` page and every admin API checks the session on the server, in the route itself, not only in a proxy or middleware layer.
- **Posts list** (`/admin/blog`): every post, newest first, with its state (Draft, Scheduled with its date, Live) and a "New post" action that asks for the headline.
- **Editor** (`/admin/blog/<id>`):
  - The fields above, with the Markdown body beside a live preview rendered by the same renderer as the public page.
  - Actions: Save draft, Publish now, Schedule (date and time), Unpublish (back to draft, slug stays locked), Delete (with a confirmation).
- **Images:**
  - Uploaded from the editor, PNG or JPG, 3 MB at most (BillMinute's limit).
  - Re-encoded on upload, which strips metadata, and saved under a random hex file name in a directory on the server outside the web root (`UPLOADS_DIR`).
  - Served from a public route such as `/blog-images/<file>`.
  - The editor inserts the Markdown image line for the uploaded file.
- **Look:** a plain, working admin. The public tasteskill gate does not apply to `/admin`. **Builder's call:** reuse the site's kit classes (forms, buttons, cards) rather than adding a UI library.
- `/admin` is excluded in `robots.txt`, sends `noindex`, and is left out of the sitemap.

## Public blog

- **`/blog`:** live posts, newest first. Each shows its headline, date, category and description. The page is built in the kit's markup like the other pages and passes the tasteskill gate and copy-lint.
- **`/blog/<slug>`:**
  - The post rendered from Markdown, with headline, date, author ("Hicaso") and category.
  - Article JSON-LD with headline, datePublished (= `publish_at`), dateModified, author and publisher as the Hicaso Organization, and mainEntityOfPage.
  - The meta title is `seo_title` or the headline, and the meta description is the description.
  - Unknown, draft or scheduled slugs return 404.
- **Freshness:** a post is visible right after Publish, or when its scheduled time passes. Pages read the database at request time, or use caching that is invalidated on every admin change. **Builder's call** (read `node_modules/next/dist/docs/` for Next 16's caching first).
- **Site-wide entries:**
  - "Blog" in the header nav and the footer's Company column.
  - Live posts in `sitemap.ts` (with `lastModified`).
  - A `## Blog` list in `llms.txt`.
  - All of these appear only when at least one post is live.
- **Markdown safety:**
  - Raw HTML in the body is escaped, not rendered.
  - Links and image sources are limited to `http(s)`, relative and `mailto` URLs.
  - The same rules apply in the admin preview. This follows BillMinute's `packages/shared/src/blog.ts` (`escapeHtml`, `SAFE_SRC`), including regression tests for script injection.

## Constraints

- **Next.js 16.2.12 App Router, React 19.2, TypeScript.** AGENTS.md applies: read the relevant guide in `node_modules/next/dist/docs/` before writing code (route handlers, server actions, caching, `proxy`).
- **New runtime dependencies are allowed for this feature only.** This lifts the site's earlier "no new runtime deps" rule. The minimum set:
  - a Postgres client
  - an auth library or a small audited equivalent
  - a Markdown parser
  - an image re-encoder
  
  BillMinute uses `better-auth`, `marked` and `sharp`, and reusing those is the default. Each addition gets one line of justification in the plan.
- **The schema lives in versioned SQL migrations in the repo**, applied by a script, not by hand.
- **Configuration comes from env vars**, added to `.env.example` with comments: `DATABASE_URL`, the auth secret, and `UPLOADS_DIR`. **The site must still build and run without `DATABASE_URL`:** the blog is simply absent, so local development of other pages and the existing tests don't need Postgres.
- **Tests:** the existing `node --test` style.
  - Pure logic: slugify, the publish checks, the state rules (draft, scheduled, live) and the Markdown renderer's XSS cases are unit-tested without a database.
  - Database and auth paths get at least one check runnable against a local Postgres.
  - `scripts/smoke.mjs` covers `/blog` and one post.
- **Site rules still hold:**
  - Plain `<a>` internal links.
  - The main action stays "Start a project" on `/contact`.
  - Kit files under `public/assets` are never edited.
  - Copy invents no proof.
- **Deploy notes** (in the repo, like BillMinute's `docs/deploy.md`) cover:
  - installing Postgres if it's missing, and creating the database and user
  - running migrations
  - creating the admin account
  - setting env vars
  - the uploads directory and its permissions
  - backing up the database and the uploads

## Calls made after the builder check (author's calls; owner to check)

- **Copy rules and posts.** The site's copy rules ("invent no proof", `INVENTED_PROOF`, copy-lint) bind the copy *we* write: the blog's templates, labels and empty states. They don't bind the owner's own post text, which is the owner's words. The publish checks stay as listed above, with no proof lint on post bodies, so cost guides with prices can be published.
- **Smoke and Postgres.** `npm run smoke` keeps running without a database. When `DATABASE_URL` is set and a live post exists, it covers `/blog` and that post. Without one, it checks that `/blog` returns 404 and that there's no Blog link in the nav. The database and auth paths get their own check, run against a local Postgres.
- **Login rate limit.** Failed attempts are counted in Postgres, not in memory, so the limit holds with any number of Node processes. The limit is per IP and also per account, over a short window (for example 10 failures in 15 minutes), so faking an IP can't bypass it and a lockout clears quickly. `TRUST_PROXY` is the number of proxy hops in front of the app (0–5, default 0), as in BillMinute's API: the client IP is read from that many hops back in `X-Forwarded-For`, or from the socket when it is 0. The deploy notes give the values: `1` behind Apache, `2` if a Cloudflare proxy (orange cloud) also sits in front.
- **Server and CDN.** BillMinute's deploy notes show the server runs Apache. Whether hicaso.com has Cloudflare in front is unknown, so the design must work either way. Blog pages and the admin are rendered per request and must not be stored by a shared cache: they send a `Cache-Control` that forbids shared caching (`private` or `no-store`), and the deploy notes add a check that `/blog` shows a just-published post through the live domain. Images under `/blog-images/` keep their long cache header, since their file names never change.
- **Images** are served by the Next app's own route from `UPLOADS_DIR`, so the setup doesn't depend on the proxy configuration. The deploy notes add a long cache header.
- **Builds** happen on the server (`npm ci && npm run build`), so `sharp`'s native binary matches the server, as BillMinute's deploy does.
- **Editing a live post** saves it and keeps it live once the full publish checks pass. **Scheduling** takes the time in the admin's local time zone and stores it in UTC. Both follow BillMinute's blog-admin behaviour.

## Left to the builder

- The ORM or query layer (plain SQL is fine).
- How sessions are stored.
- The exact admin layout.
- The caching approach for freshness.
- Where image re-encoding happens.
- The file layout.

These must stay within the constraints above, and each choice is stated in the plan.
