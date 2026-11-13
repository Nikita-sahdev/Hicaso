export type Faq = { q: string; a: string };

// The home page FAQ.
export const homeFaqs: Faq[] = [
  { q: "Do you work with clients outside India?", a: "Yes. We work with clients worldwide. Our working hours overlap with Europe and the Middle East." },
  { q: "Who owns the software you build?", a: "You do. Once the project is paid for, the code, designs and IP are yours." },
  { q: "Who works on my product?", a: "The team that builds and runs AppKavo and BillMinute." },
  { q: "How often will I see the software?", a: "Every week, in a demo of working software you can try." },
  { q: "Can you work on existing apps?", a: "Yes. We take over, fix and extend web and mobile apps, including PHP and Laravel codebases." },
];

// Site-wide answers (the home FAQ's own wording) that fill a service's FAQ out to five questions.
export const siteFaqs: Faq[] = homeFaqs.filter((f) => f.q === "Who works on my product?" || f.q === "How often will I see the software?");
