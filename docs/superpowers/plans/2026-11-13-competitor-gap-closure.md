# Competitor Gap Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the gaps the competitor audit found on hicaso.com: trust and contact quick wins first, then real proof, search pages and a team section, each shipped only once its real content exists.

**Architecture:**
- All new content lives in typed data files under `src/data/` and `src/lib/`, the same pattern as `services.ts`, `products.ts` and `proof.ts`.
- New routes are static `[slug]` pages with `dynamicParams = false`.
- Owner-supplied links and sections render only when configured or non-empty, so nothing half-filled reaches production. This follows the existing `showProof` rule.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2, TypeScript, the tasteskill kit (plain CSS and ES-module JS in `public/assets`), Node 22.18+ `node --test`, headless-Chrome `scripts/smoke.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-13-competitor-gap-audit.md`

## Owner inputs

Phase 1 tasks ship without these; their links stay hidden until the values are filled in. Each later phase is blocked until its input arrives.

| ID | Input | Needed by |
|---|---|---|
| D1 | Yes or no: "We sign an NDA before you share project details" | Task 2 |
| D2 | Yes or no: "The first 30-minute call is free" | Task 3 |
| D3 | WhatsApp number in international digits (is it +91 70091 37936?), social profile URLs, booking URL (Cal.com or Calendly) | Tasks 1, 3 (config only) |
| — | **Answered 2026-11-13:** D1 = no (no NDA, so Task 2 drops the NDA FAQ, its test and the About change). D2 = yes. D3: WhatsApp `917009137936`; social URLs are X `https://x.com/hicasollp`, YouTube `https://www.youtube.com/@hicasollp`, Instagram `https://www.instagram.com/hicasollp`, LinkedIn `https://www.linkedin.com/company/hicaso-llp/`; no booking URL yet | |
| O1 | Real clients (with permission), 2–3 case studies, testimonials, true stats, Clutch profile URL, score and review count if one exists | Tasks 5, 6 |
| O2 | Industries Hicaso has really delivered for, with 2–3 real problems solved in each | Task 8 |
| O3 | Engagement models offered and the starting price of each (or "on request") | Task 9 |
| O4 | Blog topics, approval of each draft, real price ranges for the cost articles | Task 10 |
| O5 | Team names, roles, square photos, LinkedIn URLs | Task 11 |

## Global Constraints

- Read the relevant guide in `node_modules/next/dist/docs/` before writing route code (AGENTS.md). Route handlers: `01-app/01-getting-started/15-route-handlers.md`. GET is uncached unless `export const dynamic = 'force-static'`.
- Page props use Next 16's global `PageProps<"/route/[slug]">`; `params` is a Promise and must be awaited, as in `src/app/services/[slug]/page.tsx`.
- Data-driven routes: `export const dynamicParams = false` plus `generateStaticParams()` from the data file.
- **No new runtime npm dependencies.** No MDX and no CMS: blog posts are a TS data file.
- Internal links are plain `<a href>`, not `next/link`. External links get `rel="noopener noreferrer"`.
- The main action reads **"Start a project"** and points to `/contact` everywhere. New CTAs are secondary.
- Kit files under `public/assets/` stay byte-identical. Pages use kit classes only (`section`, `wrap`, `grid`, `rows`, `card`, `btn`), as the existing pages do.
- **Never invent proof.** No client, figure, rating, badge or quote that isn't in an owner input. Copy in new data files must pass `INVENTED_PROOF` (Task 7), except `proof.ts` and the price fields of `engagement.ts`.
- Each new route passes the tasteskill gate and copy-lint the way the 2026-11-08 plan runs them: `node ~/.claude/skills/design-taste-frontend/scripts/gate.mjs --start http://localhost:3000<route> --new --kind software --category "AI, mobile and web software development" --primary "Start a project"`, repeated until `GATE: PASS` or `GATE: OPEN`, 3 rounds at most.
- Every new `*.test.ts` file is added to the `test` script in `package.json`, which lists files explicitly. Every new page route is added to `ROUTES` in `scripts/smoke.mjs` and to `src/app/sitemap.ts`.
- **Do not use `/work`.** `next.config.ts` permanently redirects it to `/products`. Case studies go to `/case-studies`.
- Commits: conventional `feat:` / `fix:` messages, no attribution lines.

## Review Focus

1. **Owner config left empty.** With `SOCIAL = []`, `BOOKING_URL = ""` and an invalid WhatsApp number, nothing renders: no empty `sameAs: []` and no dead `href`. Pinned in Task 1 and Task 3 tests.
2. **An FAQ answer that doesn't answer its question**, like today's "Who owns…?" → "Yes.". Every FAQ starting Who/Which/How/What/When must not be answered with "Yes" or "No". Pinned in Task 2.
3. **Demo content surviving `demo: false`.** No demo company name (Northwind, Contoso, Fabrikam, Tailspin, Adventure Works, Wingtip) may remain. Pinned in Task 5.
4. **A blog post with a bad or future date, or an over-long description**, which would break sorting and search snippets. Pinned in Task 10.
5. **A technology, industry or case study pointing at a service slug that doesn't exist**, which would give a broken link. Pinned in Tasks 6, 7 and 8 tests.

---

## Phase 1: Quick wins (ships now; links hidden until D3 is filled in)

### Task 1: Social links and `sameAs`

**Files:**
- Modify: `src/lib/site.ts`
- Create: `src/lib/site.test.ts`
- Modify: `src/components/layout/Footer.tsx` (the `footer__legal` row)
- Modify: `src/app/layout.tsx` (`ORG_LD`)

**Interfaces:**
- Produces in `src/lib/site.ts`:
  - `export const SOCIAL: { label: string; url: string }[] = []` (filled in from D3)
  - `export const httpsLinks = <T extends { url: string }>(links: T[]): T[]`, which keeps only `https://` URLs

- [ ] **Step 1: Write failing tests in `src/lib/site.test.ts`**

```ts
test("httpsLinks drops empty and non-https URLs", () => {
  const out = httpsLinks([{ url: "" }, { url: "http://x.com" }, { url: "javascript:alert(1)" }, { url: "https://linkedin.com/company/hicaso" }]);
  assert.deepEqual(out.map((l) => l.url), ["https://linkedin.com/company/hicaso"]);
});
test("httpsLinks of an empty list is empty", () => assert.deepEqual(httpsLinks([]), []));
```

- [ ] **Step 2:** Add the file to the `npm test` script. Run `npm test` and expect a FAIL: `httpsLinks` isn't exported.
- [ ] **Step 3:** Implement `SOCIAL` and `httpsLinks` in `site.ts`.
- [ ] **Step 4:** In `ORG_LD`, spread `...(links.length ? { sameAs: links.map((l) => l.url) } : {})` with `links = httpsLinks(SOCIAL)`. In the footer, render `httpsLinks(SOCIAL)` as `<a className="link" rel="noopener noreferrer">` after the copyright span, and render nothing when the list is empty.
- [ ] **Step 5:** Run `npm test` and expect PASS. Run `npm run dev`, view the page source of `/` and check there's no `sameAs` while `SOCIAL` is empty.
- [ ] **Step 6:** Commit `feat: social links in footer and sameAs, shown once configured`.

### Task 2: Shared FAQs, NDA line and the `ownCode` fix

**Files:**
- Create: `src/data/faqs.ts`
- Create: `src/data/faqs.test.ts`
- Modify: `src/data/services.ts` (`ownCode`)
- Modify: `src/app/page.tsx` (remove the inline `faqs`)
- Modify: `src/app/services/[slug]/page.tsx` (remove the inline `SITE_FAQS`)
- Modify: `src/app/about/page.tsx` (first `POINTS` entry)

**Interfaces:**
- Produces: `export type Faq = { q: string; a: string }`, `export const homeFaqs: Faq[]` and `export const siteFaqs: Faq[]` (the two shared answers that service pages append today)

- [ ] **Step 1: Write failing tests in `src/data/faqs.test.ts`**

```ts
const all = [...homeFaqs, ...siteFaqs, ...services.flatMap((s) => s.faqs)];
test("open questions are not answered yes/no", () => {
  for (const f of all) if (/^(Who|Which|How|What|When)\b/.test(f.q)) assert.doesNotMatch(f.a, /^(Yes|No)\b/, f.q);
});
test("ownership answer says who owns it", () =>
  assert.match(all.find((f) => f.q === "Who owns the software you build?")!.a, /^You do\./));
test("NDA question is answered", () => assert.ok(homeFaqs.some((f) => /NDA/.test(f.q))));
```

- [ ] **Step 2:** Add to `npm test` and run it. Expect a FAIL: the module is missing.
- [ ] **Step 3:** Create `faqs.ts` by moving the 5 home FAQs and the 2 `SITE_FAQS` verbatim. Add this home FAQ only if D1 is "yes": `{ q: "Will you sign an NDA?", a: "Yes. We sign your NDA, or send ours, before you share project details." }`. If D1 is "no", drop the NDA test and this FAQ. Change `ownCode.a` to `"You do. Once the project is paid for, the code and IP are yours."`. If D1 is "yes", the About first point's text becomes `"We sign an NDA before you share details. Once the project is paid for, the code, designs and IP are yours."`.
- [ ] **Step 4:** Point `page.tsx` and `services/[slug]/page.tsx` at `homeFaqs` and `siteFaqs`. Run `npm test` and expect PASS. Run `npm run smoke` and expect no failures.
- [ ] **Step 5:** Commit `fix: ownership FAQ answers who owns it; feat: NDA FAQ`.

### Task 3: Book a call, WhatsApp and the free-call offer

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/lib/site.test.ts`
- Modify: `src/app/contact/page.tsx` (the `contact-rows` list)
- Modify: `src/components/layout/Footer.tsx` (`closing__cta`)

**Interfaces:**
- Consumes: `httpsLinks` (Task 1)
- Produces:
  - `export const BOOKING_URL = ""` and `export const WHATSAPP = ""` (digits only, filled in from D3)
  - `export const whatsappUrl = (digits: string): string | null`, which returns `https://wa.me/<digits>` when `digits` matches `/^\d{10,15}$/`, otherwise `null`

- [ ] **Step 1: Write failing tests**

```ts
test("whatsappUrl", () => {
  assert.equal(whatsappUrl("917009137936"), "https://wa.me/917009137936");
  for (const bad of ["", "+91 70091 37936", "123", "9170091379361234"]) assert.equal(whatsappUrl(bad), null);
});
```

- [ ] **Step 2:** Run `npm test` and expect a FAIL.
- [ ] **Step 3:** Implement the code. On `/contact`, add a "Book a call" row (link text "Book a 30-minute call") when `httpsLinks([{ url: BOOKING_URL }]).length`, and a "WhatsApp" row when `whatsappUrl(WHATSAPP)` is set. Both open with `target="_blank" rel="noopener noreferrer"`. In the footer close, add `<a className="btn btn--secondary btn--xl">Book a 30-minute call</a>` after the primary button, under the same condition. If D2 is "yes", change the close `<p>` to `"Tell us what you need built. The first 30-minute call is free."`.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run the gate on `/contact` and `/` until `GATE: PASS` or `OPEN`.
- [ ] **Step 5:** Commit `feat: book-a-call and WhatsApp contact, shown once configured`.

### Task 4: `/llms.txt`

**Files:**
- Create: `src/lib/llms.ts`
- Create: `src/lib/llms.test.ts`
- Create: `src/app/llms.txt/route.ts`

**Interfaces:**
- Consumes: `services`, `moreServices`, `products`, `SITE_URL`, `ENQUIRY_TO`
- Produces: `export function llmsText(): string` (markdown in the llmstxt.org shape: `# Hicaso`, a `> ` summary line, then `## Services`, `## Products` and `## Company` link lists)

- [ ] **Step 1: Write failing tests**

```ts
test("llms.txt lists every page and the contact email", () => {
  const t = llmsText();
  assert.match(t, /^# Hicaso\n\n> /);
  for (const s of services) assert.ok(t.includes(`${SITE_URL}/services/${s.slug}`), s.slug);
  for (const p of products) assert.ok(t.includes(`${SITE_URL}/products/${p.slug}`), p.slug);
  assert.ok(t.includes(ENQUIRY_TO));
});
```

- [ ] **Step 2:** Run `npm test` and expect a FAIL. `llms.ts` must import with relative `.ts` paths, not `@/`, so `node --test` can resolve them, as `proof.test.ts` does.
- [ ] **Step 3:** Implement `llmsText` and `route.ts` (`export const dynamic = "force-static"`; `GET` returns `new Response(llmsText(), { headers: { "content-type": "text/plain; charset=utf-8" } })`). Leave it out of `scripts/smoke.mjs`, which checks fonts on HTML pages.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run `npm run build && npm start`, then `curl -si localhost:3000/llms.txt | head -5`. Expect `200`, `text/plain`, then `# Hicaso`.
- [ ] **Step 5:** Commit `feat: llms.txt for AI search`.

## Phase 2: Real proof (blocked on O1)

### Task 5: Real proof data

**Files:**
- Modify: `src/data/proof.ts`
- Modify: `src/data/proof.test.ts`
- Modify: `src/components/home/Proof.tsx`

**Interfaces:**
- Produces: `CaseStudy` gains `slug: string`. `proof` gains `rating?: { source: "Clutch" | "GoodFirms" | "Google"; score: number; count: number; url: string }`.

- [ ] **Step 1: Write failing tests**

```ts
test("no demo names once demo is off", () => {
  if (proof.demo) return;
  assert.doesNotMatch(JSON.stringify(proof), /Northwind|Contoso|Fabrikam|Tailspin|Adventure Works|Wingtip|Jordan Ellis|Priya Raman|Marco Bianchi/);
});
test("testimonials belong to a listed client", () => {
  for (const t of proof.testimonials) assert.ok(proof.clients.includes(t.company) || proof.caseStudies.some((c) => c.client === t.company), t.company);
});
test("rating is well-formed", () => {
  if (!proof.rating) return;
  assert.ok(proof.rating.score > 0 && proof.rating.score <= 5);
  assert.ok(Number.isInteger(proof.rating.count) && proof.rating.count > 0);
  assert.match(proof.rating.url, /^https:\/\//);
});
test("case study slugs unique and URL-safe", () => { /* same assertions as services.test "slugs are unique" */ });
```

- [ ] **Step 2:** Run `npm test`. The slug test fails while `slug` is missing.
- [ ] **Step 3:** Replace the contents with O1 exactly as given and set `demo: false`. If no rating was supplied, omit `rating`. In `Proof.tsx`, when `proof.rating` is set, render one line under the stats: `{score} on {source}, {count} reviews` linking to `url` (external rel). Change the section heading from "Projects for customers" if copy-lint asks for it.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run `npm run build && npm start` and check the proof section shows on `/`. Run the gate on `/`.
- [ ] **Step 5:** Commit `feat: real client proof replaces demo content`.

### Task 6: Case study pages (only once there are ≥ 2 real case studies)

**Files:**
- Modify: `src/data/proof.ts` (`CaseStudy` gains `title: string; challenge: string; work: string; result: string`; `title` is a plain one-line description of what was built, from O1)
- Create: `src/app/case-studies/page.tsx`
- Create: `src/app/case-studies/[slug]/page.tsx`
- Modify: `src/data/proof.test.ts`, `src/components/home/Proof.tsx` (card links to its page), `src/app/sitemap.ts`, `scripts/smoke.mjs`

**Interfaces:**
- Consumes: `proof.caseStudies`, `CaseStudy.slug` (Task 5), `getService`
- Produces: `export const getCaseStudy = (slug: string): CaseStudy | undefined` in `proof.ts`

- [ ] **Step 1:** Write a failing test: `getCaseStudy(proof.caseStudies[0].slug)` returns it, `getCaseStudy("nope")` is `undefined`, and `title`, `challenge`, `work` and `result` are non-empty for each case study. The existing "case studies link to existing services" test covers Review Focus 5.
- [ ] **Step 2:** Run `npm test` and expect a FAIL.
- [ ] **Step 3:** Build the pages:
  - The index is a `section` with a `grid` of `card`s.
  - The detail page uses `ServiceHero` with h1 = `${c.client}: ${c.title}`, fragment = `content[c.service].hero`, `contactHref="/contact?service=" + c.service`. Then one `rows` section (Challenge, What we built, Result), the testimonial quote, and the stack chips from `Proof.tsx`.
  - Add `dynamicParams = false` and JSON-LD of `@type: "CreativeWork"`.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run `npm run smoke` and expect no failures. Run the gate on `/case-studies` and on each detail page.
- [ ] **Step 5:** Commit `feat: case study pages`.

## Phase 3: Search pages

### Task 7: Technology pages (Flutter, React Native, Laravel, Next.js, Node.js)

**Files:**
- Create: `src/data/copyRules.ts` (move the regex out of `services.test.ts` "no invented proof")
- Create: `src/data/technologies.ts`
- Create: `src/data/technologies.test.ts`
- Create: `src/app/technologies/[slug]/page.tsx`
- Modify: `src/data/services.test.ts` (import `INVENTED_PROOF`), `src/app/services/[slug]/page.tsx` (after `<StackIcons>`, a `rows` line linking each technology whose `service === service.slug`), `src/app/services/page.tsx` (a "Technologies" row, like the `moreServices` row), `src/app/sitemap.ts`, `scripts/smoke.mjs`

**Interfaces:**
- Produces:
  - `export const INVENTED_PROOF: RegExp`
  - `export type Technology = { slug: string; name: string; service: string; h1: string; lead: string; uses: string[]; faqs: Faq[] }`
  - `export const technologies: Technology[]`
  - `export const getTechnology = (slug: string) => Technology | undefined`

- [ ] **Step 1: Write failing tests**

```ts
test("each technology is in the stack and maps to a real service", () => {
  const stack = allStackGroups().flatMap((g) => g.items);
  for (const t of technologies) { assert.ok(stack.includes(t.name), t.name); assert.ok(getService(t.service), t.slug); }
});
test("slugs are exactly the five", () => assert.deepEqual(technologies.map((t) => t.slug), ["flutter", "react-native", "laravel", "nextjs", "nodejs"]));
test("2–4 FAQs, 3–5 uses, no invented proof", () => { for (const t of technologies) { assert.ok(t.faqs.length >= 2 && t.faqs.length <= 4); assert.ok(t.uses.length >= 3 && t.uses.length <= 5); } assert.doesNotMatch(JSON.stringify(technologies), INVENTED_PROOF); });
```

- [ ] **Step 2:** Run `npm test` and expect a FAIL.
- [ ] **Step 3:** Write the data. Each h1 follows the copy.md h1 rule (category plus buyer), for example `"Flutter app development for Android and iOS"`. Each fact must already be stated in `services.ts`, or be general knowledge about the technology. The owner reviews the copy before merge. The page reuses `ServiceHero` (fragment `content[t.service].hero`, secondary link back to `/services/${t.service}`, `contactHref` `/contact?service=${t.service}`), `ServiceFeatures`-style cards for `uses`, `HowWeWork` and `FAQ`. Add JSON-LD `Service` with `serviceType: t.name`.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run `npm run smoke` and expect no failures. Run copy-lint and the gate on all five routes.
- [ ] **Step 5:** Commit `feat: technology pages`.

### Task 8: Industries pages (blocked on O2)

**Files:**
- Create: `src/data/industries.ts`
- Create: `src/data/industries.test.ts`
- Create: `src/app/industries/[slug]/page.tsx`
- Modify: `src/app/services/page.tsx` (an "Industries" row), `src/components/layout/Header.tsx` (an "Industries" column in the Services mega menu), `src/app/sitemap.ts`, `scripts/smoke.mjs`

**Interfaces:**
- Consumes: `INVENTED_PROOF`, `Faq`, `getService`
- Produces: `export type Industry = { slug: string; name: string; h1: string; lead: string; problems: { title: string; body: string }[]; services: string[]; faqs: Faq[] }`, `industries`, `getIndustry`

- [ ] **Step 1:** Write failing tests:
  - Every entry in `services` resolves through `getService`.
  - `problems` has 2–4 entries.
  - Slugs are unique and URL-safe.
  - Copy passes `INVENTED_PROOF`.
  - Every industry name appears among O2's names, pasted into the test as `const OWNER_INDUSTRIES = [...]`.
- [ ] **Step 2:** Run `npm test` and expect a FAIL.
- [ ] **Step 3:** Write the data from O2 only. The page uses `ServiceHero`, a `rows` section of problems, links to the listed services, linked case studies (any `proof.caseStudies` whose `industry === name`), and `FAQ`.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run `npm run smoke` and expect no failures. Run the gate on each route.
- [ ] **Step 5:** Commit `feat: industries pages`.

### Task 9: Engagement models (blocked on O3)

**Files:**
- Create: `src/data/engagement.ts`
- Create: `src/data/engagement.test.ts`
- Modify: `src/app/services/page.tsx` (a section after `#services`), `src/data/faqs.ts` (add "How do you price a project?")

**Interfaces:**
- Produces: `export type Model = { name: string; fit: string; billing: string; from?: string }`, `export const models: Model[]`

- [ ] **Step 1:** Write failing tests:
  - 2–4 models.
  - `from`, when present, matches `/^(From )?(\$|€|£|₹)[\d,]+/`.
  - `INVENTED_PROOF` passes on `name`, `fit` and `billing`.
  - The pricing FAQ exists in `homeFaqs`.
- [ ] **Step 2:** Run `npm test` and expect a FAIL.
- [ ] **Step 3:** Write O3 verbatim. Render the models as a `grid` of `card`s on `/services` (`id="engagement"`), each with the secondary link `/contact`. The pricing FAQ answer names the models and points to `/services#engagement`.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run the gate on `/services` and `/`.
- [ ] **Step 5:** Commit `feat: engagement models and pricing FAQ`.

### Task 10: Blog (blocked on O4)

**Files:**
- Create: `src/data/posts.ts`
- Create: `src/data/posts.test.ts`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Modify: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx` (a "Blog" link in Company, only when `posts.length > 0`), `src/app/sitemap.ts` (`lastModified: post.date`), `src/lib/llms.ts` (a `## Blog` list), `scripts/smoke.mjs`

**Interfaces:**
- Consumes: `LegalPage` from `src/components/legal/LegalPage.tsx` (its `h1`, `lead`, `facts`, `parts` and close props fit an article: `facts` = date and author, `parts` = sections)
- Produces:
  - `export type Post = { slug: string; title: string; description: string; date: string /* YYYY-MM-DD */; author: string; sections: { id: string; heading: string; paragraphs: string[] }[] }`
  - `export const posts: Post[]`
  - `export const sortedPosts = (): Post[]`, sorted newest first
  - `export const getPost = (slug: string) => Post | undefined`

- [ ] **Step 1: Write failing tests**

```ts
test("dates are real ISO days, not in the future", () => {
  for (const p of posts) { assert.match(p.date, /^\d{4}-\d{2}-\d{2}$/); const d = new Date(p.date + "T00:00:00Z"); assert.equal(d.toISOString().slice(0, 10), p.date); assert.ok(d.getTime() <= Date.now(), p.slug); }
});
test("descriptions fit a search snippet", () => { for (const p of posts) assert.ok(p.description.length >= 50 && p.description.length <= 160, p.slug); });
test("sortedPosts is newest first", () => { const s = sortedPosts(); for (let i = 1; i < s.length; i++) assert.ok(s[i - 1].date >= s[i].date); });
test("slugs unique and URL-safe; section ids unique per post", () => { /* as services.test */ });
```

- [ ] **Step 2:** Run `npm test` and expect a FAIL.
- [ ] **Step 3:** Build it:
  - The detail page renders `LegalPage` with `parts` mapped from `sections` (`body` = the paragraphs as `<p>`), plus JSON-LD `Article` (`headline`, `datePublished`, `author` as Organization Hicaso, `mainEntityOfPage`).
  - The index lists `sortedPosts()` as `card`s with title, date and description.
  - Header and footer show "Blog" only when `posts.length > 0`.
  - Post bodies come only from drafts the owner approved (O4). Cost articles use only O4's price ranges.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run `npm run smoke` and expect no failures, including the phone nav sheet at 390. Run copy-lint and the gate on `/blog` and each post.
- [ ] **Step 5:** Commit `feat: blog`.

## Phase 4: Trust

### Task 11: Team section on `/about` (blocked on O5)

**Files:**
- Create: `src/data/team.ts`
- Create: `src/data/team.test.ts`
- Create: `public/images/team/<slug>.jpg` (O5 photos, square, at least 600px)
- Modify: `src/app/about/page.tsx` (a new `#team` section after `#studio`)

**Interfaces:**
- Produces: `export type Member = { slug: string; name: string; role: string; photo: string /* /images/team/<slug>.jpg */; linkedin?: string }`, `export const team: Member[]`

- [ ] **Step 1:** Write failing tests:
  - Each `photo` exists on disk (`existsSync("public" + m.photo)`).
  - `linkedin`, when set, passes `httpsLinks`.
  - Slugs are unique.
- [ ] **Step 2:** Run `npm test` and expect a FAIL.
- [ ] **Step 3:** Render a `grid` of `card`s (photo with `alt={name}`, name, role, LinkedIn link with external rel), only when `team.length > 0`. Add a `Person` entry per member to the About page JSON-LD.
- [ ] **Step 4:** Run `npm test` and expect PASS. Run the gate on `/about`.
- [ ] **Step 5:** Commit `feat: team section on about`.

## Deferred (add a task when the trigger is met)

| Item | Trigger |
|---|---|
| Certification and partner badge row (about and the home proof section) | The ISO 27001, SOC 2 or AWS/Google partner certificate is in hand |
| Open roles on careers (`src/data/roles.ts`) | The first real opening |
| Hire-developer pages | The owner decides to sell dedicated developers |
| Ebooks, reports and other lead magnets | 5 or more published posts |
| Live chat | Not planned. WhatsApp and booking cover instant contact |
