import { ownCode, type Service } from "./services.ts";

// One page per technology Hicaso already lists in a service's stack (src/data/services.ts). Every fact restates
// that file: the stack, the store release, weekly demos, taking over existing code, talking trade-offs through.
// `service` is the parent service's slug: the page borrows its hero fragment and stack diagram.
export type Technology = {
  slug: string;
  name: string;
  service: string;
  h1: string;
  lead: string;
  usesTitle: string;
  uses: { title: string; body: string }[];
  faqs: Service["faqs"];
};

const takeOver = (what: string) => ({
  title: `Takes over an existing ${what}`,
  body: "We read the code you already have, then fix it and add the features you need.",
});

export const technologies: Technology[] = [
  {
    slug: "flutter",
    name: "Flutter",
    service: "mobile-app-development",
    h1: "Flutter app development for Android and iOS",
    lead: "Our team in India builds Flutter apps for Android and iOS from one Dart codebase and handles the store release. You see working builds in weekly demos.",
    usesTitle: "What we build with Flutter",
    uses: [
      { title: "Ships one app to both stores", body: "One Dart codebase builds the Android and iOS apps, so a feature reaches both together." },
      { title: "Connects to Firebase or your API", body: "Firebase as the app's backend, or the API your web app already uses." },
      takeOver("Flutter app"),
    ],
    faqs: [
      { q: "Flutter or native Kotlin and Swift?", a: "It depends on the product. We build both ways and talk through the trade-offs with you before choosing." },
      { q: "Do you publish the app to the stores?", a: "Yes. We handle the App Store and Google Play release as part of the project." },
      ownCode,
    ],
  },
  {
    slug: "react-native",
    name: "React Native",
    service: "mobile-app-development",
    h1: "React Native mobile app development",
    lead: "Our team in India builds React Native apps for Android and iOS from one codebase and handles the store release. You see working builds in weekly demos.",
    usesTitle: "What we build with React Native",
    uses: [
      { title: "Ships one app to both stores", body: "One React Native codebase builds the Android and iOS apps, so a feature reaches both together." },
      { title: "Connects to Firebase or your API", body: "Firebase as the app's backend, or a Node.js API built by the same team." },
      takeOver("React Native app"),
    ],
    faqs: [
      { q: "React Native or Flutter for my app?", a: "It depends on the product and your team. We build with both and talk through the trade-offs with you before choosing." },
      { q: "Do you publish the app to the stores?", a: "Yes. We handle the App Store and Google Play release as part of the project." },
      ownCode,
    ],
  },
  {
    slug: "laravel",
    name: "Laravel",
    service: "web-development",
    h1: "Laravel development for web apps and stores",
    lead: "Our team in India builds Laravel web apps, APIs and online stores, and maintains and upgrades older PHP apps. You see working software in weekly demos.",
    usesTitle: "What we build with Laravel",
    uses: [
      { title: "Builds web apps and APIs", body: "Laravel with MySQL or PostgreSQL, behind a React or Next.js front end or Laravel's own pages." },
      { title: "Builds online stores", body: "Storefronts on Laravel and MySQL, built from scratch or extended from the shop you run." },
      { title: "Upgrades older PHP and Laravel apps", body: "We take over CodeIgniter and older Laravel codebases, fix what is broken and move them forward." },
    ],
    faqs: [
      { q: "Can you upgrade an old Laravel version?", a: "Yes. We maintain and upgrade existing PHP and Laravel applications, reading what is there before we change it." },
      { q: "Which databases do you use with Laravel?", a: "MySQL or PostgreSQL, picked with you to fit the app and your hosting." },
      ownCode,
    ],
  },
  {
    slug: "nextjs",
    name: "Next.js",
    service: "web-development",
    h1: "Next.js development for web apps and sites",
    lead: "Our team in India builds web apps, SaaS products and marketing sites with React and Next.js, on Node.js or your own API. You see working software in weekly demos.",
    usesTitle: "What we build with Next.js",
    uses: [
      { title: "Builds web apps and SaaS products", body: "React and Next.js front ends with a Node.js backend and PostgreSQL or MongoDB." },
      { title: "Builds marketing sites", body: "Pages rendered on the server, so visitors and search engines get the content on first load." },
      { title: "Adds AI features to your web app", body: "Assistants and search over your own data, from the team that does our generative AI work." },
    ],
    faqs: [
      { q: "Can you work on our existing Next.js app?", a: "Yes. We can pick up an existing web codebase, read what is there and extend or fix it." },
      { q: "Which backend do you pair with Next.js?", a: "Node.js with PostgreSQL or MongoDB, or the API you already run." },
      ownCode,
    ],
  },
  {
    slug: "nodejs",
    name: "Node.js",
    service: "web-development",
    h1: "Node.js backend and API development",
    lead: "Our team in India builds Node.js APIs and backends for web and mobile apps, and the services behind our AI work. You see working software in weekly demos.",
    usesTitle: "What we build with Node.js",
    uses: [
      { title: "Builds APIs for web and mobile apps", body: "APIs with PostgreSQL, MySQL or MongoDB behind them, for the apps your customers use." },
      { title: "Connects AI models to your tools", body: "Services that call OpenAI, Claude or Gemini and the tools your AI agents use." },
      takeOver("Node.js backend"),
    ],
    faqs: [
      { q: "Node.js or PHP for my backend?", a: "It depends on the product and what you already run. We build both and talk through the trade-offs with you before choosing." },
      { q: "Which databases do you use with Node.js?", a: "PostgreSQL, MySQL or MongoDB, picked with you to fit the app." },
      ownCode,
    ],
  },
];

export const getTechnology = (slug: string): Technology | undefined => technologies.find((t) => t.slug === slug);
