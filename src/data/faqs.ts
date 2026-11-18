export type Faq = { q: string; a: string };

// The home page FAQ: the questions a founder asks before writing to us. Ownership, the team and weekly demos are the
// home page's dark band, so they are not repeated here. Facts only from PRODUCT.md (NDA on request, monthly or hourly
// billing for dedicated developers, the free 30-minute call, replies by email).
export const homeFaqs: Faq[] = [
  { q: "Do you work with clients outside India?", a: "Yes. We work with clients worldwide. Our working hours overlap with Europe and the Middle East." },
  { q: "What is the first step of a project?", a: "Send the enquiry form or book a free 30-minute call. We reply by email and talk through what you need." },
  { q: "Will you sign a non-disclosure agreement?", a: "Yes. We sign your NDA before you share the details of your project." },
  { q: "How do you charge?", a: "Dedicated developers are billed monthly or by the hour. For a project, tell us what you need and we reply by email with how we would build it." },
  { q: "Can you work on existing apps?", a: "Yes. We take over, fix and extend web and mobile apps, including PHP and Laravel codebases." },
];

// Site-wide answers that fill a service's or technology's FAQ out to five questions.
export const siteFaqs: Faq[] = [
  { q: "Who works on my product?", a: "The team that builds and runs AppKavo and BillMinute." },
  { q: "How often will I see the software?", a: "Every week, in a demo of working software you can try." },
];
