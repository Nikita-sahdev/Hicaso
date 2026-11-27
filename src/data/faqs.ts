export type Faq = { q: string; a: string };

// The home page FAQ: the questions a founder asks before writing to us. Ownership, the team and weekly demos are the
// home page's dark band, so they are not repeated here. Facts only from PRODUCT.md (NDA on request, monthly or hourly
// billing for dedicated developers, the free 30-minute call, replies by email).
export const homeFaqs: Faq[] = [
  // the question Google shows for "custom software development company" (People also ask, 2026-11-25)
  { q: "What is a custom software development company?", a: "A team that designs and builds software to order for one client, instead of selling a ready-made product. Hicaso builds AI, mobile and web software for companies, and runs its own products, AppKavo and BillMinute." },
  { q: "Do you work with clients outside India?", a: "Yes. We work with clients worldwide. Our working hours overlap with Europe and the Middle East." },
  { q: "What is the first step of a project?", a: "Send the enquiry form or book a free call. We reply by email and talk through what you need." },
  { q: "Will you sign an NDA?", a: "Yes. We sign your NDA before you share the details of your project." },
  { q: "How do you charge?", a: "Dedicated developers are billed monthly or by the hour. For a project, tell us what you need and we reply by email with how we would build it." },
  { q: "Can you work on existing apps?", a: "Yes. We take over, fix and extend web and mobile apps, including PHP and Laravel codebases." },
];

// Site-wide answers added to every service's and technology's FAQ.
export const siteFaqs: Faq[] = [
  { q: "Who works on my product?", a: "The team that builds and runs AppKavo and BillMinute." },
  { q: "How often will I see the software?", a: "Every week, in a demo of working software you can try." },
  { q: "Will you sign an NDA before I share the details?", a: "Yes. We sign your NDA before you share the details of your project." },
  // what buyers search for on every service page; answered from the billing facts, with no figures (pricing undecided)
  {
    q: "What does the price depend on?",
    a: "On what the first release must do, the platforms it runs on and the systems it connects to, and on whether you hire developers monthly or by the hour. Send the enquiry form and we reply by email with how we would build it.",
  },
];
