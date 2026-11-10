# Hicaso Services + Product Studio Site — Design

Date: 2026-11-05
Status: approved by user ("all true and continue", 2026-11-05)
Supersedes: `2026-10-11-hicaso-studio-site-design.md` (products-only studio)

## 1. Intent

Reposition hicaso.com from a pure product studio into a **software development company with two sides**:

1. **Services**: Hicaso builds software for clients worldwide.
2. **Product studio**: Hicaso builds and runs its own products. Today these are AppKavo and BillMinute.

The site structure follows esferasoft.com (a services-company site): a grouped Services menu, a hero with a "Start your project" call to action, a services grid, a tech stack section, "why us", an FAQ, a contact form with a budget field, and an expanded footer. Visually, everything follows the new `DESIGN.md` (Mollie-style: white canvas, black type, Oat cream cards, Espresso panels, Ledger Brown pill buttons, IBM Plex Mono eyebrows).

**Why:** Hicaso wants to sell development services to global clients. Its own shipped products are the strongest proof that it can deliver.

**Success:** a visiting client understands within one screen that Hicaso builds AI, mobile and web software for clients and also ships its own products. They can reach a service page in one click and can send an enquiry with their budget from any page in two clicks.

### Decisions (from the user)

| Topic | Decision |
|---|---|
| Positioning | Services company + product studio, one brand |
| Services offered | Gen AI, agentic AI, mobile apps (native Android, native iOS, Flutter, React Native), web (React, Next.js, PHP, Laravel, CodeIgniter, Node.js) "and others" |
| Clients | Global |
| Structure reference | https://www.esferasoft.com/ |
| Visual system | `DESIGN.md` (Mollie style, as pasted) |
| Proof (client logos, stats, testimonials, case studies, awards) | Not available yet. User will add later. **Do not invent any.** |
| Capability claims | Confirmed true by the user: client owns code and IP once paid; the AI, mobile (Kotlin, Swift/SwiftUI, Firebase) and database (incl. MongoDB) stacks in section 3; "the team that builds our products builds yours", weekly demos, working-hours overlap with Europe and the Middle East. Nothing beyond these may be claimed. |

### Calls made by Claude (user said "continue"; user may override)

| Topic | Call |
|---|---|
| Enquiry form delivery | No backend. On submit, the form builds a `mailto:hello@hicaso.com` link with subject and body filled in from the fields and opens it. A server-side email can replace this later. |
| Logo | Keep the existing blue-dot wordmark unchanged. The blue dot is the only blue on the site. DESIGN.md's "no blue" rule applies to everything else. |
| "coordinator" | Read as **CodeIgniter**. |
| Service areas | Four, from the user's list (section 3). "And others" is covered by adding entries to the data file later. |
| Proof slot | Hicaso's own products stand in as proof (section 4.3, step 4). There are no empty "logos coming soon" placeholders. |
| Photography | DESIGN.md is photo-led, but there are no real photos. Use product screenshots, Espresso demo panels and type-led sections instead. No stock photos. |
| Adamina font | Not loaded, because it only styles testimonials and there are none. Add it with testimonials later. |

## 2. Goals, non-goals, anti-goals

**Goals**
- Services pages generated from one data file, like products already are. Adding a service = one data entry.
- Home page that sells services first and shows the product studio second.
- A working enquiry form with name, email, country, budget, service of interest and message.
- The whole site restyled to DESIGN.md tokens.

**Non-goals (not in this build)**
- Industries pages, on-demand solutions, blog, video testimonials, location pages, awards, client logo strip, stats counters, case studies.
- A form backend, CRM or analytics.
- Dark mode and i18n.

**Anti-goals (would make this a failure even if it works)**
- Any invented proof: fake numbers ("1200+ projects"), fake testimonials, fake client logos, fake awards, fake "delivered in 90 days" promises.
- A template-agency look: gradient blobs, purple/indigo, heavy drop shadows, bold 82px display type (DESIGN.md says weight 400).
- Products becoming hard to find. The product studio side must stay one click from the home page and the header.

## 3. Service data

New file `src/data/services.ts`, the single source of truth for every service surface (header menu, footer, home grid, `/services`, `/services/[slug]`, contact form select). It mirrors `src/data/products.ts`.

```ts
export type Service = {
  slug: string;          // URL-safe, unique
  name: string;          // "Generative AI"
  eyebrow: string;       // mono label, e.g. "AI"
  tagline: string;       // one line, used in menus and cards
  description: string;   // 2–3 sentences for the detail page hero
  offerings: { title: string; body: string }[];        // 4–6 "what we build" items
  stack: { group: string; items: string[] }[];         // technologies, grouped
  faqs: { q: string; a: string }[];                    // 2–4, honest, no promises of timelines/prices
};
```

Entries, in this order (the copy below is the builder's starting draft and may be tightened):

| slug | name | eyebrow | Offerings (titles) | Stack |
|---|---|---|---|---|
| `generative-ai` | Generative AI | AI | LLM-powered features in existing apps; RAG over your documents and data; chat assistants and copilots; content and document generation; model evaluation and guardrails | OpenAI, Anthropic Claude, Google Gemini, open-source models; LangChain/LlamaIndex; vector DBs (pgvector, Pinecone); Python, Node.js |
| `agentic-ai` | Agentic AI | AI | AI agents that use your tools and APIs; multi-step workflow automation; MCP servers and tool integrations; human-in-the-loop approvals; monitoring and evals for agents | Claude Agent SDK, OpenAI Agents SDK, LangGraph, MCP; Python, Node.js |
| `mobile-app-development` | Mobile App Development | Mobile | Native Android apps; native iOS apps; cross-platform apps with Flutter; cross-platform apps with React Native; App Store and Google Play release | Kotlin, Swift/SwiftUI, Flutter/Dart, React Native; Firebase |
| `web-development` | Web Development | Web | Web apps and SaaS products; marketing sites and CMS; APIs and backends; e-commerce; maintenance and upgrades of existing PHP apps | React, Next.js, Node.js, PHP, Laravel, CodeIgniter; MySQL, PostgreSQL, MongoDB |

FAQs per service: two to four honest questions (for example "Do I own the code?" → yes, plus "Can you work with my existing codebase?"). No fixed prices or timelines.

**Test:** `src/data/services.test.ts`, added to the `npm test` script next to the products test. It checks that slugs are unique and URL-safe, that every service has 4–6 offerings and at least one stack group, and that there are 2–4 FAQs.

## 4. Site map and pages

```
/                        Home (services-first, studio second)
/services                All services
/services/[slug]         Service detail (generated from services.ts, generateStaticParams)
/products                All products (kept, restyled)
/products/[slug]         Product overview (kept, restyled)
/about                   Rewritten: services company + product studio
/careers                 Kept, restyled, wording updated to the two-sided company
/contact                 Enquiry form + contact details
/privacy, /terms         Kept, wording updated to cover client services as well as products
```

**Redirects** (`next.config.ts`): remove `/services` and `/services/:path*` → `/products`, because these routes are real again. Keep `/work` → `/products`.

### 4.1 Header (DESIGN.md "Public Navigation Bar")
- A 54px Paper bar. Logo on the left.
- Links: **Services** (menu), **Products** (menu), About, Careers.
- On the right: one Ledger Brown pill, **"Start a project"**, which links to `/contact`.
- The Services menu lists each service (eyebrow, name, tagline) plus "All services". The Products menu stays as it is. Both menus keep the existing behavior: open on click, close on Escape or an outside click, and `aria-expanded` set. Only one menu is open at a time.
- On mobile, the toggle opens a full list: Services with its sub-links, Products with its sub-links, About, Careers, Contact.

### 4.2 Footer
- A top row with the line "Have a project in mind?" and a Ledger Brown "Start a project" pill.
- Columns: **Services** (from data), **Products** (from data), **Company** (About, Careers, Contact), **Legal** (Privacy, Terms), **Contact** (email, phone, address, hours Mon–Fri 9:00–6:00 IST).
- A hairline, then "© {year} Hicaso LLP".

### 4.3 Home, top to bottom
1. **Hero**: left-aligned display headline (Inter 82px/400, -2.4px tracking; smaller on mobile). Draft: "We build AI, mobile and web software — and ship our own products." To the right on desktop (below on mobile) sits a Quiet Graphite supporting paragraph and two pills: Ledger Brown "Start your project" (→ `/contact`) and Oat "See our products" (→ `/products`).
2. **Services grid**: mono eyebrow "SERVICES", a heading, and a 2×2 grid of Oat cards, one per service (eyebrow, name, tagline, Copper "Explore →" link to its detail page). Below it, a "View all services" link.
3. **Tech stack**: mono eyebrow "TECHNOLOGIES". Grouped rows (AI, Mobile, Web frontend, Backend and databases) built from the union of the service stacks. Text chips in Paper cells with #f7f4f1 hairlines (DESIGN.md "Product Category Cell"). No logos are needed.
4. **Product studio**: mono eyebrow "PRODUCT STUDIO", heading "We also build our own." Short copy explains that the same team designs, ships and runs these products. Reuse the existing themed product panels (each product in its own colors and font, screenshot included). This is the proof section.
5. **How we work**: four steps in a row (Discover → Design → Build → Launch and support). Each has a mono number, a title and one sentence. No time promises.
6. **Why Hicaso**: three to four honest points, for example "You own the code and IP", "The team that builds our products builds yours", "Working hours that overlap with Europe and the Middle East" (9:00–18:00 IST ends around 8 AM US Eastern, so no US-overlap claim), "Clear communication and weekly demos". Nothing unverifiable.
7. **FAQ**: 4–6 company-level questions, using native `<details>`/`<summary>`, no JS.
8. **Closing CTA**: an Espresso Panel (16px radius) with Paper text, "Tell us what you want to build", and a Paper pill "Start your project" → `/contact`.

### 4.4 Services index `/services`
A hero (eyebrow, display heading, paragraph), then a list of large Oat cards, one per service, each showing its offerings preview and a link. After that come "How we work" (shared component), then the closing CTA.

### 4.5 Service detail `/services/[slug]`
- A hero with eyebrow, name, description and pills (Start your project, See all services).
- **What we build**: offerings as Oat cards.
- **Technologies**: grouped stack chips.
- A shared "How we work" section.
- **FAQ**: per-service `<details>`.
- The closing CTA, with the contact link pre-selecting this service (`/contact?service=<slug>`).
- `generateMetadata` gives a per-service title and description. An unknown slug calls `notFound()`.

### 4.6 Contact `/contact`
- A hero: "Let's talk about your project."
- On the left, the **enquiry form** (client component). Fields:
  - name (required)
  - email (required, `type=email`)
  - country (text)
  - service (select: the services from data, then "Something else")
  - budget (select: Under $5k, $5k–$15k, $15k–$50k, $50k+, Not sure)
  - message (required, `maxLength=1000`, with a live character counter)
- Submitting validates with native HTML validation, then sets `window.location.href` to a `mailto:hello@hicaso.com` URL with the subject `Project enquiry — <service>` and a body listing every field. Use `encodeURIComponent`. After submit, show an inline note: "Your email app should open with the message ready. If it didn't, email hello@hicaso.com directly."
- `?service=<slug>` pre-selects the service.
- On the right, the contact details card (email, phone, address, hours), as today.

### 4.7 About, Careers, Products, Legal
- **About**: hero "A software company that ships its own products." Two Oat cards cover what Hicaso does: Services (links to `/services`) and Product studio (links to `/products`). Then principles (reuse or reword `Principles`) and the company facts list (legal name, based in, serves clients worldwide, products).
- **Careers**: same content, wording changed from "builds its own products" to "builds for clients and for itself". Restyled.
- **Products pages**: content unchanged. Restyle only the Hicaso frame. The themed product panels keep their own colors and fonts.
- **Privacy / Terms**: add a short paragraph saying that client project work is governed by the contract signed with each client. Keep the rest.

## 5. Visual system implementation

- Replace the `@theme` block in `src/app/globals.css` with DESIGN.md tokens: colors, radii (cards 16, media 24, pills 9999), spacing, the type scale and the subtle shadows. Remove the old Wise/blue tokens and fix every use of them.
- Fonts via `next/font/google`: Inter (already loaded; also used as the display face, standing in for "Inter Variable") and **IBM Plex Mono** (400, 500) for eyebrows and labels. Keep Bricolage Grotesque and Poppins for the product panels.
- Rebuild the type utility classes (`.t-display`, etc.) to the DESIGN.md scale: display 82/400/-2.4px on desktop and about 44–48px on mobile; section headings; body 16px Quiet Graphite; eyebrow 13px/500 IBM Plex Mono uppercase.
- `LinkButton` variants: `filled` = Ledger Brown with the inset highlight, `light` = Oat Surface with Ink text, `onDark` = Paper with Ink text, `text` = Copper link. Pills are 16px 24px, Inter 16/500.
- Focus ring: 2px Ink outline (Paper on dark panels). Selection uses a light Oat tint.
- No outer drop shadows on cards.
- Keep CSS Modules plus Tailwind v4 `@theme`, as today. No new runtime dependencies.

## 6. Constraints

- Next.js 16.2 (see `AGENTS.md`: read `node_modules/next/dist/docs/` before writing route code; `params` and `searchParams` are async in this version).
- No new npm dependencies. `lucide-react` icons are fine where an icon is needed.
- Accessibility: one `h1` per page, labelled form fields, visible focus, keyboard-operable menus, and at least 4.5:1 text contrast (Quiet Graphite #595959 on Paper and Oat passes).
- `npm run build`, `npm run lint` and `npm test` must pass.

## 7. Left to the builder

- Exact marketing copy, within the honesty rules above.
- Component breakdown and file names (for example a shared `Eyebrow`, `HowWeWork`, `FAQ`, `ClosingCTA`).
- Responsive breakpoints and exact spacing within the DESIGN.md 4px scale.
- Whether the home services grid is 2×2 or 4-across on wide screens.
