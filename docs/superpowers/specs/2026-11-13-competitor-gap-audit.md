# Competitor Gap Audit: Design

**Date:** 2026-11-13
**Source:** an audit of 21 peer software companies (19 loaded): Simform, Radixweb, Appinventiv, MindInventory, TatvaSoft, QBurst, Bacancy, Netguru, STX Next, The Software House, Miquido, N-iX, Intellias, Leobit, thoughtbot, WillowTree/TELUS Digital, Fueled, Infinum, Cheesecake Labs, EPAM, Endava. Appinventiv and EPAM blocked automated access.

## Findings: how many of the 19 peers have each item, and what Hicaso has

| Item | Peers with it | Hicaso today |
|---|---|---|
| Blog / guides | 19/19 | none |
| Client logo strip | 17/19 | demo only, hidden in production |
| Social links | 17/19 | none; no `sameAs` in the Organization JSON-LD |
| Named case studies | 16/19 | demo only |
| Industries pages | 16/19 | none |
| Headline stats | 16/19 | only counts of services, products and days |
| Certifications / partner badges | 15/19 | none |
| Named testimonials | 14/19 | demo only |
| Clutch / GoodFirms rating | 12/19 | none |
| Team / leadership page | 12/19 | none (stock photos) |
| Free consultation / estimate CTA | 11/19 | "Start a project" only |
| NDA / IP / security assurance | 10/19 | IP ownership stated; NDA never mentioned |
| Technology pages | 10/19 | stack shown only inside service pages |
| Cost / pricing content | 8/19 (all 7 European) | none (budget ranges exist in the enquiry form) |
| Engagement models | 8/19 | none |
| Calendar booking | 3/19 | none |
| WhatsApp | 0/19 | none |
| llms.txt | 1/19 (QBurst) | none |

Hicaso has things most peers don't: two products of its own (AppKavo, BillMinute), weekly demos, and a clear statement that the client owns the code.

Defect found during the audit: the FAQ "Who owns the software you build?" in `src/data/services.ts` (`ownCode`) answers "Yes. …".

## Requirements

1. **Quick wins (no owner content needed; links show only once configured):** social links in the footer and in `sameAs`; an NDA and ownership statement; a "Book a call" link and WhatsApp on `/contact` and in the footer close; an offer of a free 30-minute call; `/llms.txt`; the fix to the `ownCode` FAQ.
2. **Real proof:** real clients, case studies, testimonials, stats and an optional Clutch rating replace the demo data, then `demo: false`. Case study pages once there are at least 2 real case studies.
3. **Search pages:** technology pages (from the stack already listed), industries pages (only for industries Hicaso has worked in), engagement models with the owner's prices, and a blog.
4. **Trust:** a team section with real photos on `/about`.
5. **Deferred until a trigger is met:** certification badges (once obtained), open roles on careers (when hiring), hire-developer pages (if dedicated developers are sold), lead magnets (after 5+ posts), live chat (not planned).

## Rules

- Never invent proof. No client, figure, rating, badge or quote that the owner hasn't supplied and confirmed.
- A link that isn't configured doesn't render. No placeholder URLs reach production.
- The main action stays "Start a project" → `/contact`.
