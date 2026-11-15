# Hicaso Blog and Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The owner writes, schedules and publishes Markdown blog posts in a private `/admin`, and they appear on a public `/blog` in the current site design.

**Architecture:**
- **Storage:** posts, the one admin account, sessions and failed logins live in Postgres. Access is plain SQL through `pg`. Pure rules (slugs, publish checks, states, the Markdown renderer) sit in small modules that run in the browser preview, on the server and under `node --test`.
- **Admin:** server actions do the writing. Each action and each `/admin` page checks the session itself.
- **Public pages:** `/blog` and `/blog/<slug>` render per request (`force-dynamic`), so scheduled posts appear on time and no shared cache holds them. Every other page becomes ISR (`revalidate = 60`) so the "Blog" link can appear. Each admin change also calls `revalidatePath("/", "layout")`, so that link updates at once.
- **Images:** re-encoded by `sharp` into `UPLOADS_DIR` and served by a Next route.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2, TypeScript, Node ≥ 22.18, Postgres 16. New runtime dependencies:
- `pg`: the Postgres client.
- `marked`: the Markdown parser BillMinute already uses.
- `sharp`: re-encodes uploads and strips their metadata.

Dev dependency: `@types/pg`.

**Spec:** `docs/superpowers/specs/2026-11-13-blog-admin-design.md`

## Choices this plan makes (the spec left them to the builder)

- **Auth is built on `node:crypto` (scrypt, random session tokens stored as SHA-256 hashes), not `better-auth`.**
  - **Why:** there is one user and no sign-up, reset, OAuth or roles. better-auth would add four tables and a dependency for a single login row. scrypt and `timingSafeEqual` are the audited primitives such a library would use anyway.
  - **No auth secret:** stored tokens are random and hashed, so nothing needs signing and the spec's "auth secret" env var is dropped.
- **Query layer:** plain SQL with `pg`, no ORM.
- **Session store:** the `admin_sessions` table.
- **Migrations:** `db/migrations/NNN_name.sql`, applied in name order by `npm run db:migrate`, with each applied file recorded in `schema_migrations`.
- **Freshness:** as in Architecture above. The spec requires that blog pages must not be stored by a shared cache, and Next sends `private, no-cache, no-store` for `force-dynamic` pages.
- **Client IP:** the App Router does not expose the socket address. With `TRUST_PROXY=0` the per-IP bucket is the single key `"unknown"`, and the per-account limit still applies. Production sits behind Apache, so it sets `TRUST_PROXY` to 1 or more.
- **Re-encoding:** happens on the server in the upload action. Images are capped at 1600 px wide, as BillMinute does.
- **Admin pages sit inside the root layout**, so the site header and footer show above and below them. No route-group restructure.
- **Uploads in development:** `UPLOADS_DIR` defaults to `./uploads` (git-ignored) when unset.

## Global Constraints

- AGENTS.md: read the relevant guide in `node_modules/next/dist/docs/` before writing Next code. The guides that matter here:
  - `01-app/02-guides/caching-without-cache-components.md`
  - `01-app/03-api-reference/04-functions/revalidatePath.md`, `cookies.md`, `redirect.md`
  - `01-app/02-guides/authentication.md` and `data-security.md`
  - `01-app/03-api-reference/03-file-conventions/route.md`
  - `01-app/03-api-reference/05-config/01-next-config-js/serverActions.md`
- Modules under `src/lib/blog/`, `src/lib/admin/`, `src/lib/db.ts` and `src/lib/migrate.ts` use **relative `.ts` imports** (as `src/lib/llms.ts` does), so `node --test` and `node scripts/*.ts` can load them. No `@/` imports and no `server-only` in them.
- Import `pg` as `import pg from "pg"` (it is CommonJS; a named ESM import of `Pool` fails under plain Node).
- Every new `*.test.ts` file is added by name to the `test` script in `package.json`.
- Tests that need Postgres skip when `TEST_DATABASE_URL` is unset: `{ skip: !process.env.TEST_DATABASE_URL && "TEST_DATABASE_URL not set" }`. Local run:
  - Create the database once: `createdb hicaso_test`.
  - Run the tests: `TEST_DATABASE_URL=postgres://localhost/hicaso_test npm test`.
  - Postgres 16 is at `/opt/homebrew/opt/postgresql@16/bin`. Start it with `brew services start postgresql@16` if it's down.
- **The site builds and runs without `DATABASE_URL`.** `getPool()` returns `null`. The blog, `/admin` and `/blog-images` then return 404, the nav, footer, sitemap and llms.txt have no blog entries, and the existing `npm test` passes.
- **Post rules:**
  - The headline is required, at most 200 characters, on one line.
  - The slug matches `^[a-z0-9]+(-[a-z0-9]+)*$`, is at most 80 characters, is unique, and is locked for ever at the first publish or schedule.
  - To publish, the description must be 50–160 characters, the category must be one of `ai`, `mobile`, `web` or `cost-guides`, and the body must not be empty.
  - A scheduled time must be in the future.
- **Images:** PNG or JPEG only, at most 3 MB (`3_000_000` bytes). They are re-encoded and saved under a random hex name, outside the web root, in `UPLOADS_DIR`.
- **Markdown:**
  - Raw HTML is escaped.
  - Links are allowed only to `http(s):`, `mailto:`, `#` and `/` paths (not `//`).
  - Image sources are allowed only from `/blog-images/` and `https:`.
  - The same renderer runs in the admin preview and on the public page.
- **Login limit:** 10 failures per IP, or per account, in 15 minutes. `TRUST_PROXY` is the number of proxy hops (0–5, default 0): `1` behind Apache, `2` with Cloudflare also in front.
- **Session cookie:** `hicaso_admin`, `httpOnly`, `secure` in production, `sameSite: "strict"`, `path: "/admin"`, 14 days.
- **`/admin`:** disallowed in `robots.txt`, sends `noindex, nofollow`, and stays out of the sitemap.
- **Site rules:** plain `<a>` internal links; the main action stays "Start a project" on `/contact`; never edit files under `public/assets`; copy we write invents no proof. Admin forms must **not** use the kit's `form` class, because `system.js` takes over `form.form` submits.
- **Gates:** the public `/blog` pages pass the tasteskill gate (3 rounds), copy-lint and `npm run smoke`. The gate does not apply to `/admin`.

## Review Focus

1. **A session check missing from one admin path.** Every `/admin` page and every server action must call `requireAdmin()` before touching data. An action called directly by POST, without its page, must still be refused.
2. **A post body that tries script injection** (`<script>`, `<img onerror>`, `javascript:` and `//evil` links, `data:` images). It must render inert in both the preview and the public page.
3. **A draft or scheduled post reached by its URL.** `/blog/<slug>` must 404 until `publish_at <= now()`, then show it with no admin action.
4. **Two posts with the same headline, or a slug edited to one already taken.** The second gets `-2`, or the save is refused with a message. No 500.
5. **Postgres down or `DATABASE_URL` unset while the site runs.** Normal pages still render with no Blog link. `/blog` returns an error or 404, never a page pretending to be empty.

Each item has a test in the task that owns the code: Task 7 for item 1, Task 3 for item 2, Task 4 for items 3, 4 and 5, Task 1 for item 5, and Task 10's smoke run for item 5.

---

### Task 1: Database connection and migrations

**Files:**
- Create: `src/lib/db.ts`, `src/lib/migrate.ts`, `scripts/migrate.ts`, `db/migrations/001_blog.sql`, `src/lib/testDb.ts`, `src/lib/db.test.ts`
- Modify: `package.json` (deps `pg`, dev dep `@types/pg`; scripts `db:migrate`; test list), `.env.example`, `.gitignore` (`/uploads`)

**Interfaces:**
- Produces:
  - `getPool(): pg.Pool | null`: reads `DATABASE_URL` on every call and keeps one `Pool` per URL value, so tests can switch it. Returns `null` when it's unset.
  - `migrate(pool: pg.Pool): Promise<string[]>`: returns the names of the files it applied.
  - `freshDb(): Promise<pg.Pool | null>`: a test helper. Without `TEST_DATABASE_URL` it returns `null`. Otherwise it sets `DATABASE_URL` to that value, migrates, and truncates every table.
  - Tables:
    - `blog_posts(id uuid pk default gen_random_uuid(), slug text unique not null, headline text not null, seo_title, description, category, body text not null default '', status text check in ('draft','published'), publish_at timestamptz, slug_locked boolean default false, created_at, updated_at)`, with `check ((status = 'draft') = (publish_at is null))`
    - `admin_users(id serial pk, email text unique not null, password_hash text not null, created_at)`
    - `admin_sessions(token_hash text pk, user_id int references admin_users on delete cascade, expires_at timestamptz not null)`
    - `login_failures(id bigserial pk, ip text, email text, at timestamptz default now())`, indexed on `at`

- [ ] **Step 1: Write the failing tests** in `src/lib/db.test.ts`:
  - `getPool returns null without DATABASE_URL`: delete the env var, import, and expect `null`.
  - `migrate creates the tables and is idempotent` (DB skip rule):
    - `freshDb()`, then `migrate(pool)` again returns `[]`.
    - `to_regclass('blog_posts')` and the other three tables are non-null.
  - `a draft cannot carry a publish time` (DB): an insert with status `'draft'` and `publish_at = now()` rejects with code `23514`.
- [ ] **Step 2: Run them.** `npm i pg && npm i -D @types/pg`, then `node --test src/lib/db.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3: Write the code.**
  - `db.ts`.
  - The SQL.
  - `migrate.ts`: creates `schema_migrations(name text pk, applied_at timestamptz default now())`, then runs each unapplied `db/migrations/*.sql` in name order, each in its own transaction.
  - `scripts/migrate.ts`: calls it, prints the applied names, and exits 1 without `DATABASE_URL`.
  - `testDb.ts`.
  - `.env.example` gets `DATABASE_URL=`, `UPLOADS_DIR=/var/lib/hicaso/uploads` and `TRUST_PROXY=1`, each with a comment.
- [ ] **Step 4: Run** `TEST_DATABASE_URL=postgres://localhost/hicaso_test node --test src/lib/db.test.ts`. Expected: 3 pass. Without the env var: 1 pass, 2 skipped. Then run `npm test`: all pass.
- [ ] **Step 5: Commit** with the message `feat: Postgres connection and migrations for the blog`.

### Task 2: Post rules

**Files:**
- Create: `src/lib/blog/post.ts`, `src/lib/blog/post.test.ts`

**Interfaces:**
- Produces:
  - `CATEGORIES = [{ id: "ai", label: "AI" }, { id: "mobile", label: "Mobile" }, { id: "web", label: "Web" }, { id: "cost-guides", label: "Cost guides" }] as const` and `categoryLabel(id: string): string`
  - `SLUG_RE`
  - `slugify(text: string): string`: BillMinute's algorithm (NFKD, strip accents, lower-case, non-alphanumerics to `-`, trim `-`, slice to 80).
  - `type PostFields = { slug: string; headline: string; seoTitle: string; description: string; category: string; body: string }`
  - `type Problem = { field: keyof PostFields | "publishAt"; message: string }`
  - `draftProblems(f: PostFields): Problem[]`: rules any save must pass. The slug matches `SLUG_RE` and is ≤ 80 characters. The headline is non-empty, ≤ 200 characters and on one line. The SEO title and description are on one line, the SEO title ≤ 200 and the description ≤ 500. The body is ≤ 100 000 characters.
  - `publishProblems(f: PostFields): Problem[]`: `draftProblems` plus these:
    - description 50–160 characters
    - category one of the four
    - body not blank
    - no line starting `# ` (headings start at `##`; the page already has the h1)
  - `postState(p: { status: "draft" | "published"; publishAt: Date | null }, now: Date): "draft" | "scheduled" | "live"`

- [ ] **Step 1: Write the failing tests:**
  - `slugify("Flutter vs React Native: Which in 2027?") === "flutter-vs-react-native-which-in-2027"`
  - `slugify("Café ÄI") === "cafe-ai"`
  - `slugify("!!!") === ""`
  - `slugify("a".repeat(100)).length === 80`
  - `publishProblems` on a complete post (description 60 characters, category `ai`, body `"## Hi\n\ntext"`) is `[]`.
  - Each of these alone gives exactly one problem on the named field:
    - a description of 49 characters, or of 161 characters (`description`)
    - category `""` (`category`)
    - body `"  "` (`body`)
    - body `"# Title"` (`body`)
    - slug `"Bad Slug"` (`slug`)
    - a headline with a newline (`headline`)
  - `draftProblems` passes an empty description, category and body.
  - `postState`:
    - `draft` when the status is draft
    - `scheduled` when published with `publishAt` one minute after `now`
    - `live` when `publishAt` equals `now`
- [ ] **Step 2: Run** `node --test src/lib/blog/post.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement `post.ts`.** Messages are one plain sentence naming the fix, for example `"Write a description of 50 to 160 characters; it is 49."`.
- [ ] **Step 4: Run** it, then add it to the test script. Expected: PASS.
- [ ] **Step 5: Commit** with the message `feat: blog post rules (slug, publish checks, states)`.

### Task 3: Markdown renderer

**Files:**
- Create: `src/lib/blog/markdown.ts`, `src/lib/blog/markdown.test.ts`
- Modify: `package.json` (dep `marked`)

**Interfaces:**
- Consumes: `slugify` (Task 2).
- Produces:
  - `renderMarkdown(src: string): string`: GFM, synchronous. It carries BillMinute's `escapeHtml`, `SAFE_HREF = /^(https?:|mailto:|\/(?!\/)|#)/i` and `SAFE_SRC = /^(\/blog-images\/|https:)/i` rules (`~/invoice-app-blog/packages/shared/src/blog.ts`). Each `h2` and `h3` gets an `id` from `slugify(text)`, made unique within the document with `-2`, `-3` and so on.
  - `outline(src: string): { id: string; text: string }[]`: the `h2`s, with the same ids.

- [ ] **Step 1: Write the failing tests:**
  - These inputs must not produce `<script`, ` onerror=`, `href="javascript:`, `href="//`, `src="data:` or `src="http:`:
    - `<script>alert(1)</script>`
    - `<img src=x onerror=alert(1)>`
    - `[x](javascript:alert(1))`
    - `[x](//evil.com)`
    - `![x](data:image/png;base64,AA)`
    - `![x](http://a.com/i.png)`
  - The raw-HTML case renders `&lt;script&gt;`.
  - `[a](https://a.com)`, `[b](/contact)` and `[c](mailto:a@b.c)` keep their hrefs.
  - `![d](/blog-images/0123456789abcdef0123456789abcdef.png)` keeps its src.
  - `renderMarkdown("## Cost\n\n## Cost")` has `id="cost"` and `id="cost-2"`, and `outline` of the same input returns those ids.
- [ ] **Step 2: Run** `node --test src/lib/blog/markdown.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** it with `new Marked({ gfm: true, async: false })` and renderer overrides (`html`, `link`, `image`, `heading`). Per-document id state is created inside each call.
- [ ] **Step 4: Run** it, then add it to the test script. Expected: PASS.
- [ ] **Step 5: Commit** with the message `feat: safe Markdown renderer for blog posts`.

### Task 4: Post store

**Files:**
- Create: `src/lib/blog/store.ts`, `src/lib/blog/store.test.ts`

**Interfaces:**
- Consumes: `getPool` and `freshDb` (Task 1); `PostFields`, `Problem`, `draftProblems`, `publishProblems` and `slugify` (Task 2).
- Produces:
  - `type Post = PostFields & { id: string; status: "draft" | "published"; publishAt: Date | null; slugLocked: boolean; createdAt: Date; updatedAt: Date }`
  - `type PostSummary = Pick<Post, "slug" | "headline" | "description" | "category" | "publishAt" | "updatedAt">`
  - `type SaveResult = { ok: true; post: Post } | { ok: false; problems: Problem[] }`
  - Public reads:
    - `listLivePosts(): Promise<PostSummary[]>`: live only, `publish_at desc`. Returns `[]` when there's no pool, and throws on a DB error.
    - `listLivePostsSafe(): Promise<PostSummary[]>`: the same, but it logs a DB error with `console.error` and returns `[]`.
    - `getLivePost(slug: string): Promise<Post | null>`
  - Admin:
    - `listPosts(): Promise<Post[]>`: `created_at desc`.
    - `getPost(id: string): Promise<Post | null>`: `null` when the id isn't a UUID.
    - `createPost(headline: string): Promise<SaveResult>`: the slug is `slugify(headline) || "post"`, with `-2`, `-3` and so on if taken.
    - `savePost(id: string, f: PostFields): Promise<SaveResult>`:
      - Runs `draftProblems`. For a published post it runs `publishProblems` instead, and a failure leaves the stored post unchanged.
      - Ignores `f.slug` when `slug_locked`.
      - A unique violation becomes `{ field: "slug", message: "Another post already uses this address." }`.
      - Sets `updated_at = now()`.
    - `publishPost(id: string, at?: Date): Promise<SaveResult>`:
      - With `at` at or before now, returns `{ field: "publishAt", message: "Pick a time in the future." }`.
      - Runs `publishProblems` on the stored post.
      - Sets `status = 'published'`, `publish_at = at ?? now()` and `slug_locked = true`.
    - `unpublishPost(id: string): Promise<void>`: sets the status to draft and `publish_at` to null. The slug stays locked.
    - `deletePost(id: string): Promise<void>`

- [ ] **Step 1: Write the failing tests** (DB skip rule; each test starts with `freshDb()`):
  1. A created draft isn't in `listLivePosts` and `getLivePost(slug)` is `null`.
  2. After `savePost` with valid fields and `publishPost(id)`, it is in both, and `slugLocked` is true.
  3. `publishPost(id, new Date(Date.now() + 3600e3))` makes it not live. Running `update blog_posts set publish_at = now() - interval '1 second'` then makes it live, with no other call.
  4. `createPost("Same")` twice gives the slugs `same` and `same-2`. A `savePost` setting the second slug to `same` returns `ok: false` with the slug message.
  5. On a live post, `savePost` with a 10-character description returns `ok: false`, and `getPost` still has the old description.
  6. After `unpublishPost`, the status is draft and `slugLocked` is still true. A `savePost` with a new slug keeps the old one.
  7. `publishPost` on a draft with an empty description returns `ok: false` with a `description` problem.
  8. `getPost("not-a-uuid")` returns `null`.
  9. Without `DATABASE_URL` (no DB needed), `listLivePosts()` returns `[]`.
  10. With `DATABASE_URL=postgres://localhost:1/none` (no DB needed), `listLivePosts()` rejects and `listLivePostsSafe()` returns `[]`.
- [ ] **Step 2: Run** `TEST_DATABASE_URL=… node --test src/lib/blog/store.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `store.ts`. Rows map from snake_case to the `Post` fields. "Live" is `status = 'published' and publish_at <= now()`, using the database clock.
- [ ] **Step 4: Run** it with and without `TEST_DATABASE_URL`, then add it to the test script. Expected: all pass, or the DB tests skip.
- [ ] **Step 5: Commit** with the message `feat: blog post store`.

### Task 5: Admin account, sessions and login limit

**Files:**
- Create: `src/lib/admin/password.ts`, `src/lib/admin/accounts.ts`, `src/lib/admin/loginLimit.ts`, `scripts/create-admin.ts`, `src/lib/admin/admin.test.ts`
- Modify: `package.json` (script `"admin:create": "node scripts/create-admin.ts"`; test list)

**Interfaces:**
- Consumes: `getPool` and `freshDb` (Task 1).
- Produces:
  - `hashPassword(pw: string): Promise<string>`: the format is `scrypt$16384$8$1$<salt b64>$<hash b64>`, with a 16-byte salt and a 64-byte key.
  - `verifyPassword(pw: string, stored: string): Promise<boolean>`: compares with `timingSafeEqual` and returns `false` for a malformed stored value.
  - `DUMMY_HASH: string`: a fixed valid hash, verified when the account is missing so a wrong email takes as long as a wrong password.
  - Accounts and sessions:
    - `findAdmin(email): Promise<{ id: number; email: string; passwordHash: string } | null>`: the email is trimmed and lower-cased.
    - `upsertAdmin(email, passwordHash): Promise<void>`
    - `createSession(userId): Promise<{ token: string; expiresAt: Date }>`: 32 random bytes as base64url. It stores `sha256(token)` hex, lasts 14 days, and deletes expired rows.
    - `sessionUser(token: string | undefined): Promise<{ id: number; email: string } | null>`
    - `deleteSession(token): Promise<void>`
  - Login limit:
    - `trustProxyHops(v: string | undefined): number`: an integer 0–5, otherwise 0.
    - `clientIp(xff: string | null, hops: number): string`: the entry `hops` places from the end of `X-Forwarded-For`, trimmed. Returns `"unknown"` when `hops` is 0 or the entry is missing.
    - `LOGIN_LIMIT = 10`, `LOGIN_WINDOW_MINUTES = 15`
    - `isLimited(ip, email): Promise<boolean>`: true when there are at least 10 failures in 15 minutes for that IP, or for that email.
    - `recordFailure(ip, email): Promise<void>`: also deletes rows older than a day.
    - `clearFailures(email): Promise<void>`

- [ ] **Step 1: Write the failing tests** in `admin.test.ts`.

  Pure:
  - A hash round-trips.
  - The wrong password gives `false`.
  - `verifyPassword("x", "garbage")` gives `false`.
  - Two hashes of the same password differ.
  - `trustProxyHops`: `"1"` → 1, `"9"` → 0, `undefined` → 0.
  - `clientIp`: `("1.1.1.1, 2.2.2.2", 1)` → `"2.2.2.2"`, `("1.1.1.1, 2.2.2.2", 2)` → `"1.1.1.1"`, `("1.1.1.1", 0)` → `"unknown"`, `(null, 1)` → `"unknown"`.

  DB:
  - A session token from `createSession` resolves to its user.
  - A session whose `expires_at` is set to the past resolves to `null`.
  - After `deleteSession`, the token resolves to `null`.
  - After 9 `recordFailure` calls the account isn't limited; the 10th limits it. A different email from the same IP is also limited, and the same email from another IP is too.
  - `clearFailures(email)` lifts the per-account limit.
- [ ] **Step 2: Run** `node --test src/lib/admin/admin.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** the three modules, then `scripts/create-admin.ts`:
  - Usage: `npm run admin:create -- owner@example.com`.
  - The password comes from the `ADMIN_PASSWORD` env var, or from a hidden prompt on stdin.
  - It refuses passwords shorter than 12 characters.
  - It upserts the account and prints `Admin account ready: <email>`.
- [ ] **Step 4: Run** the tests with and without the DB, then add them to the test script. Run the script once against `hicaso_test` and confirm it prints the line. Expected: PASS.
- [ ] **Step 5: Commit** with the message `feat: admin account, sessions and login rate limit`.

### Task 6: Sign-in, sign-out and the admin guard

**Files:**
- Create:
  - `src/lib/admin/guard.ts`
  - `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`
  - `src/app/admin/login/page.tsx`, `src/app/admin/login/LoginForm.tsx`, `src/app/admin/login/actions.ts`
- Modify: `src/app/robots.ts`

**Interfaces:**
- Consumes: Task 5's exports and `getPool`.
- Produces:
  - `ADMIN_COOKIE = "hicaso_admin"`
  - `requireAdmin(): Promise<{ id: number; email: string }>`: calls `notFound()` when `getPool()` is null, reads the cookie with `await cookies()`, and calls `redirect("/admin/login")` when there's no valid session.
  - `loginAction(prev: { error?: string }, fd: FormData): Promise<{ error?: string }>`
  - `logoutAction(): Promise<void>`: deletes the session, clears the cookie and redirects to `/admin/login`.

- [ ] **Step 1: Write the code.**
  - **`admin/layout.tsx`:** exports `metadata = { robots: { index: false, follow: false } }` and renders `<section className="section"><div className="wrap">{children}</div></section>`.
  - **`admin/page.tsx`:** `await requireAdmin()`, then `redirect("/admin/blog")`.
  - **The login page:**
    - Calls `notFound()` without a pool, and redirects to `/admin/blog` when already signed in.
    - Shows an h1 "Sign in" and `LoginForm`, a client component using `useActionState(loginAction, {})` with email and password fields and an error line (`role="alert"`).
  - **`loginAction`:**
    - Gets the IP with `clientIp((await headers()).get("x-forwarded-for"), trustProxyHops(process.env.TRUST_PROXY))`.
    - When `isLimited`, returns `{ error: "Too many attempts. Try again in 15 minutes." }`.
    - Verifies against `user?.passwordHash ?? DUMMY_HASH`. On failure it calls `recordFailure` and returns `{ error: "Email or password is wrong." }`.
    - On success it calls `clearFailures` and `createSession`, sets the cookie with the Global Constraints options and `expires`, and calls `redirect("/admin/blog")`.
  - **`robots.ts`:** `disallow: ["/api/", "/admin"]`.
- [ ] **Step 2: Verify.** Run `npx next typegen && npx tsc --noEmit`, then start the app against a migrated DB with an admin created in Task 5 (`DATABASE_URL=postgres://localhost/hicaso_test npm run dev -- -p 3477`):
  - `/admin` redirects to `/admin/login`.
  - A wrong password shows the error.
  - The 11th wrong attempt shows the limit message.
  - The right password, after running `delete from login_failures`, lands on `/admin/blog` (a 404 until Task 7 is fine) with the cookie set as `HttpOnly; SameSite=Strict; Path=/admin`.
  - `curl -s localhost:3477/robots.txt` lists `/admin`.
  - Without `DATABASE_URL`, `/admin/login` returns 404.
- [ ] **Step 3: Commit** with the message `feat: admin sign-in with session cookie and rate limit`.

### Task 7: Posts list, editor and actions

**Files:**
- Create: `src/app/admin/blog/page.tsx`, `src/app/admin/blog/actions.ts`, `src/app/admin/blog/[id]/page.tsx`, `src/app/admin/blog/[id]/Editor.tsx`, `src/app/admin/blog/actions.test.ts`

**Interfaces:**
- Consumes: Task 4's store, Task 2's `publishProblems`, `postState` and `CATEGORIES`, Task 3's `renderMarkdown`, and Task 6's `requireAdmin` and `logoutAction`.
- Produces these server actions, each starting with `await requireAdmin()` and calling `refreshSite()` after a successful write:
  - `createPostAction(fd: FormData)`: on success, redirects to `/admin/blog/<id>`.
  - `savePostAction(id: string, f: PostFields): Promise<SaveResult>`
  - `publishPostAction(id: string, f: PostFields, atIso?: string): Promise<SaveResult>`: saves, then publishes. `atIso` is parsed with `new Date()`, and an invalid date returns a `publishAt` problem.
  - `unpublishPostAction(id: string): Promise<void>`
  - `deletePostAction(id: string)`: redirects to `/admin/blog`.
  - `refreshSite()`: calls `revalidatePath("/", "layout")`, `revalidatePath("/sitemap.xml")` and `revalidatePath("/llms.txt")`.

- [ ] **Step 1: Write the failing test.** Review Focus 1: every admin path checks the session first. `actions.test.ts` reads source files as text:
  - Test `every admin action checks the session first`: for each `export async function (\w+)` in `src/app/admin/blog/actions.ts`, the first statement of the body is `await requireAdmin();`. The same check runs over `logoutAction` in `src/app/admin/login/actions.ts`; `loginAction` is the one exempt.
  - Test `every admin page checks the session`: every `page.tsx` under `src/app/admin` except `login/page.tsx` contains `await requireAdmin()`.
- [ ] **Step 2: Run** `node --test src/app/admin/blog/actions.test.ts`. Expected: FAIL (file not found).
- [ ] **Step 3: Implement.**
  - **List page:** `await requireAdmin()`. Then:
    - a "New post" form (a headline field and "Create")
    - a table of posts with headline, state and date, where Scheduled shows its local date, each headline linking to the editor
    - a "Sign out" form posting `logoutAction`
  - **Editor page:** `await requireAdmin()`, calls `notFound()` when `getPost` is null, and renders `<Editor post={…} />` with dates as ISO strings.
  - **`Editor`** (client):
    - Fields: headline, slug (read-only with a note when `slugLocked`), SEO title, description with a live character count, a category `<select>` from `CATEGORIES`, and the body `<textarea>`.
    - Beside the body, a preview `<div dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />`.
    - A list of the current `publishProblems(fields)`.
    - Buttons: Save draft (or "Save" when the post is published), Publish now, Schedule (a `datetime-local` input whose value is sent as `new Date(value).toISOString()`), Unpublish (when published), and Delete (after `confirm("Delete this post for good?")`).
    - Publish and Schedule are disabled while there are problems.
    - Server problems from a `SaveResult` show next to their fields.
    - Uses `useTransition`.
- [ ] **Step 4: Verify.** Run `node --test src/app/admin/blog/actions.test.ts` (PASS; add it to the test script) and `npx tsc --noEmit`. Then sign in on the dev server and:
  - create "Test post", fill it in and Publish: the state shows Live
  - Schedule another post an hour ahead: Scheduled
  - Unpublish: Draft, with the slug still locked
  - Delete: gone
  - type `<script>alert(1)</script>` in the body: the preview shows it as text
- [ ] **Step 5: Commit** with the message `feat: admin posts list and Markdown editor`.

### Task 8: Image uploads

**Files:**
- Create: `src/lib/blog/images.ts`, `src/lib/blog/images.test.ts`, `src/app/blog-images/[file]/route.ts`
- Modify: `src/app/admin/blog/actions.ts` (add `uploadImageAction`), `Editor.tsx` (upload control), `next.config.ts`, `package.json` (dep `sharp`; test list)

**Interfaces:**
- Produces:
  - `IMAGE_MAX_BYTES = 3_000_000` and `IMAGE_FILE = /^[a-f0-9]{32}\.(png|jpg)$/`
  - `uploadsDir(): string`: `process.env.UPLOADS_DIR`, or `path.join(process.cwd(), "uploads")`.
  - `sniffImage(b: Uint8Array): "png" | "jpg" | null`: by magic bytes (`89 50 4E 47` or `FF D8 FF`).
  - `saveImage(b: Buffer, dir: string): Promise<{ ok: true; path: string } | { ok: false; error: string }>`:
    - Rejects a file over the limit, or one that fails the sniff or the decode, with `"Upload a PNG or JPEG image up to 3 MB."`.
    - Re-encodes with `sharp(b, { failOn: "error" }).rotate().resize({ width: 1600, withoutEnlargement: true })`, then `.png()` or `.jpeg({ quality: 85 })`.
    - Writes `<16 random bytes hex>.<ext>` into `dir`, creating it with mode `0o700`.
    - Returns `/blog-images/<file>`.
  - `readImage(file: string, dir: string): Promise<{ body: Buffer; type: "image/png" | "image/jpeg" } | null>`: `null` unless `file` matches `IMAGE_FILE` and the file exists.
  - `uploadImageAction(fd: FormData): Promise<{ ok: true; path: string } | { ok: false; error: string }>`: starts with `await requireAdmin()`.

- [ ] **Step 1: Write the failing tests** (`os.tmpdir()` subdirectories):
  - A PNG made with `sharp({ create: { width: 4, height: 4, channels: 3, background: "#2456d6" } }).withMetadata({ exif: { IFD0: { Copyright: "x" } } }).png()` saves:
    - the path matches `^/blog-images/[a-f0-9]{32}\.png$`
    - `sharp(saved).metadata()` has no `exif`
  - A buffer of `IMAGE_MAX_BYTES + 1` bytes is rejected.
  - `Buffer.from("GIF89a…")` is rejected.
  - A buffer that starts `89 50 4E 47` but is truncated is rejected.
  - `readImage("../etc/passwd", dir)` and `readImage("x.png", dir)` both return `null`.
- [ ] **Step 2: Run** `npm i sharp && node --test src/lib/blog/images.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **`images.ts`.**
  - **The route:** `GET(_req, ctx: RouteContext<"/blog-images/[file]">)` returns 404 without a pool or a file. Otherwise it returns the body with `content-type`, `cache-control: public, max-age=31536000, immutable` and `x-content-type-options: nosniff`.
  - **`next.config.ts`:** `experimental: { serverActions: { bodySizeLimit: "4mb" } }`.
  - **`Editor`:** a file input (`accept="image/png,image/jpeg"`). A successful upload inserts `![Describe the image](<path>)` at the cursor; an error shows the message.
  - **The action-guard test** from Task 7 covers `uploadImageAction` automatically.
- [ ] **Step 4: Run** the tests (add them to the test script) and `node --test src/app/admin/blog/actions.test.ts`, then on the dev server:
  - upload a JPEG from a phone: it shows in the preview, and the file in `./uploads` has no EXIF (`sharp(file).metadata()`)
  - `curl -sI localhost:3477/blog-images/<file>` shows the cache header
  - a 4 MB file shows the error
- [ ] **Step 5: Commit** with the message `feat: blog image uploads, re-encoded and served from UPLOADS_DIR`.

### Task 9: Public blog pages

**Files:**
- Create: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `listLivePosts` and `getLivePost` (Task 4), `renderMarkdown` and `outline` (Task 3), `categoryLabel` (Task 2), and `SITE_URL` and `ldJson` (`src/lib/site.ts`).

**`/blog`:**
- `export const dynamic = "force-dynamic"`. The page calls `notFound()` when `listLivePosts()` is empty.
- Metadata: title `"Blog — Hicaso"`, plus a description.
- The h1 names the category in 2–8 words and at most 48 characters. Starting copy: h1 "AI, mobile and web development blog", lead "Guides from the Hicaso team in India on building AI, mobile and web software." The gate and copy-lint have the final say.
- The list: a kit `.rows` list (as `src/app/technologies/[slug]/page.tsx` uses). Each row has the headline as a plain `<a href="/blog/<slug>">`, then the date, the category label, and the description. Dates use `toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })`.
- The last section holds a visual (R5, `checkLastVisual` in smoke): a kit `ui-doc` card (`public/assets/ui/doc/fragment.html` markup, read-only) showing the newest post. Its label is the category and date, its title the headline, and its text the description.

**`/blog/[slug]`:**
- `force-dynamic`. The page calls `notFound()` for anything but a live post.
- `generateMetadata`:
  - title `seoTitle || headline`
  - description
  - `alternates.canonical` set to `${SITE_URL}/blog/${slug}`
  - `openGraph.type` set to `"article"`
- One section on the kit grid:
  - **Left:** h1 = headline; a meta line with the date, "Hicaso" and the category; then the body from `renderMarkdown` in a `measure stack-4` column (as `src/components/legal/LegalPage.tsx` sets long text).
  - **Right:** an "In this post" `.ui ui-panel` card listing `outline(body)` as `#id` links. It always shows the category and date, so the section always holds a visual (R5).
- Article JSON-LD with:
  - `headline`
  - `datePublished` (`publish_at` ISO) and `dateModified` (`updated_at` ISO)
  - `author` and `publisher` as `{ "@type": "Organization", name: "Hicaso", url: SITE_URL }`
  - `mainEntityOfPage` set to the canonical URL
  - `description`

- [ ] **Step 1: Seed a live post** into a dev DB (`hicaso_dev`, migrated) with `psql`. The post has a 60–160-character description, category `web`, and a body with two `##` sections and one image line. Add a scheduled post for an hour ahead.
- [ ] **Step 2: Write the pages.**
- [ ] **Step 3: Verify.**
  - `npx tsc --noEmit`, then `npm run build && DATABASE_URL=postgres://localhost/hicaso_dev npm start -- -p 3477`.
  - `/blog` lists the live post only.
  - The scheduled post's URL returns 404, and returns 200 after `update … set publish_at = now()`, with no restart.
  - `curl -sI localhost:3477/blog | grep -i cache-control` contains `no-store`.
  - Without `DATABASE_URL`, `/blog` returns 404.
- [ ] **Step 4: Run the gate** on both pages: `node ~/.claude/skills/design-taste-frontend/scripts/gate.mjs --start http://localhost:3477/blog --new --kind software --category "AI, mobile and web software development" --primary "Start a project"`, then `node gate.mjs`, for up to 3 rounds, fixing what it reports. Then run `copy-lint.mjs <saved html> --kind software` on each page. Expected: both clean.
- [ ] **Step 5: Commit** with the message `feat: public blog index and post pages`.

### Task 10: Blog in the nav, footer, sitemap, llms.txt and smoke

**Files:**
- Modify: `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/app/sitemap.ts`, `src/lib/llms.ts`, `src/lib/llms.test.ts`, `src/app/llms.txt/route.ts`, `scripts/smoke.mjs`

**Interfaces:**
- Consumes: `listLivePostsSafe` and `PostSummary` (Task 4).
- Produces: `llmsText(posts: PostSummary[] = []): string`, plus `Header` and `Footer` each taking `{ blog?: boolean }`.

- [ ] **Step 1: Write the failing tests** in `llms.test.ts`:
  - `llmsText()` has no `## Blog`.
  - `llmsText([{ slug: "a-post", headline: "A post", description: "D", category: "web", publishAt: new Date(), updatedAt: new Date() }])` contains `## Blog` and `- [A post](${SITE_URL}/blog/a-post): D`, placed before `## Company`.
- [ ] **Step 2: Run** `node --test src/lib/llms.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **`llms.ts`:** the Blog section.
  - **`llms.txt/route.ts`:** replace `dynamic = "force-static"` with `export const revalidate = 60`, and make `GET` async, using `listLivePostsSafe()`.
  - **`sitemap.ts`:** `export const revalidate = 60`. When there are live posts it adds `/blog`, and each post with `lastModified: updatedAt`.
  - **`layout.tsx`:** `export const revalidate = 60`. `RootLayout` becomes async and computes `const blog = (await listLivePostsSafe()).length > 0`, passing `blog` to `<Header>` and `<Footer>`.
  - **`Header`:** when `blog`, a `<div className="nav__item"><a className="nav__link" href="/blog">Blog</a></div>` after Careers.
  - **`Footer`:** when `blog`, `{ label: "Blog", href: "/blog" }` after Careers in Company.
  - **`smoke.mjs`:** before the Chrome loop, `const blogRes = await fetch(BASE + "/blog")`.
    - When it's 200: push `"/blog"` and the first `/blog/<slug>` href found in its HTML into `ROUTES`, and fail unless its `cache-control` contains `no-store`.
    - When it isn't: push `{ path: "/blog", status: 404 }`.
    - Always push `{ path: "/blog/no-such-post", status: 404 }`.
    - In `checkNav`, fail when a header `a[href="/blog"]` exists and `/blog` isn't 200, or is missing while `/blog` is 200.
- [ ] **Step 4: Verify.**
  - `npm test`: all pass.
  - Run `npm run build && npm start -- -p 3477` without `DATABASE_URL` and run `SMOKE_BASE=http://localhost:3477 npm run smoke`. Expected: pass, apart from the two failures already present on the base branch ("Services menu not visible on hover" and "/contact fields without a visible label: website"). It covers `/blog` as a 404 with no Blog link.
  - Repeat with `DATABASE_URL=postgres://localhost/hicaso_dev` (one live post). Expected: same result, now covering `/blog` and the post, with "Blog" in the nav and footer.
  - `curl localhost:3477/llms.txt` and `/sitemap.xml` list the post.
- [ ] **Step 5: Commit** with the message `feat: blog link, sitemap and llms.txt entries once a post is live`.

### Task 11: Deploy notes and the end-to-end check

**Files:**
- Create: `docs/deploy-blog.md`

- [ ] **Step 1: Write `docs/deploy-blog.md`** as numbered commands for the Apache server:
  1. Install Postgres if `psql --version` fails (`sudo apt install postgresql`). Create the user and database (`sudo -u postgres createuser hicaso -P`, then `createdb -O hicaso hicaso`).
  2. Add these to `.env.local`:
     - `DATABASE_URL=postgres://hicaso:<pw>@localhost/hicaso`
     - `UPLOADS_DIR=/var/lib/hicaso/uploads`
     - `TRUST_PROXY=1`, or `2` if Cloudflare's orange cloud is on for hicaso.com (check in the Cloudflare DNS tab)
  3. Create the uploads directory with `sudo mkdir -p /var/lib/hicaso/uploads`, `chown` it to the user that runs the app, and `chmod 700` it.
  4. Build on the server with `npm ci && npm run build`, so sharp matches the server, then run `npm run db:migrate`.
  5. Create the account with `npm run admin:create -- <owner email>`.
  6. Restart the app the way it runs today.
  7. Run the checks:
     - `https://hicaso.com/admin` asks you to sign in.
     - Publish a test post, open `https://hicaso.com/blog` in a private window, and the post is there.
     - `curl -sI https://hicaso.com/blog | grep -i cache-control` shows `no-store`.
     - Unpublish or delete the test post.
  8. Back up with a nightly cron of `pg_dump hicaso | gzip > /var/backups/hicaso-$(date +\%F).sql.gz` and `tar czf /var/backups/hicaso-uploads-$(date +\%F).tgz /var/lib/hicaso/uploads`, keeping 14 days.
  9. Note that a CDN must not cache `/blog*` or `/admin*` HTML. Cloudflare doesn't by default; a "Cache Everything" rule would.
- [ ] **Step 2: Run the end-to-end check** locally in a browser, against `npm start` with `hicaso_dev`. Sign in, create a post, upload an image, publish, then see it on `/blog` with the image, and see "Blog" in the nav after a refresh. Schedule a second post 2 minutes ahead, confirm it 404s, and confirm it appears after the time passes. Sign out, and confirm `/admin/blog` redirects to the sign-in page.
- [ ] **Step 3: Commit** with the message `docs: deploy notes for the blog and admin`.
