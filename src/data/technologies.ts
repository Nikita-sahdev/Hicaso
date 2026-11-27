import { ownCode, type Service } from "./services.ts";

// One page per technology Hicaso already lists in a service's stack (src/data/services.ts). Every fact restates
// that file: the stack, the store release, weekly demos, taking over existing code, talking trade-offs through.
// `service` is the parent service's slug: the page borrows its hero fragment and stack diagram.
export type Technology = {
  slug: string;
  name: string;
  service: string;
  h1: string;
  // the search title, from US keyword volume (DataForSEO via treg, 2026-11-25): "<name> development company" is what
  // buyers type; the H1 stays the readable line on the page. Unset: the H1 is the title.
  seoTitle?: string;
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
    seoTitle: "Flutter App Development Company — Hicaso",
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
    seoTitle: "React Native App Development Company — Hicaso",
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
    seoTitle: "Laravel Development Company — Hicaso",
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
    seoTitle: "Next.js Development Company — Hicaso",
    lead: "Our team builds web apps, SaaS products and marketing sites with React and Next.js, on Node.js or your own API. You see working software in weekly demos.",
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
    seoTitle: "Node.js Development Company: Backend and APIs — Hicaso",
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
  // added 2026-11-20 (programmatic SEO): each is already in a service's stack, and every line restates that service
  {
    slug: "react",
    name: "React",
    service: "web-development",
    h1: "React development for web apps and SaaS",
    seoTitle: "React Development Company for Web Apps — Hicaso",
    lead: "Our team in India builds React front ends for web apps, SaaS products and stores, on Node.js, Laravel or your API. You see working software in weekly demos.",
    usesTitle: "What we build with React",
    uses: [
      { title: "Builds web app and SaaS front ends", body: "React, often with Next.js, in front of a Node.js or Laravel backend and MySQL, PostgreSQL or MongoDB." },
      { title: "Builds custom storefronts", body: "React and Next.js shop fronts for stores built on Laravel, when Shopify or WooCommerce do not fit." },
      { title: "Adds AI features to your web app", body: "Assistants and search over your own data, built with the team behind our generative AI work." },
      takeOver("React app"),
    ],
    faqs: [
      { q: "React on its own or with Next.js?", a: "Next.js is built on React and renders pages on the server. We pick with you, based on the app and where it runs." },
      { q: "Can you work on our existing React app?", a: "Yes. We can pick up an existing web codebase, read what is there and extend or fix it." },
      ownCode,
    ],
  },
  {
    slug: "python",
    name: "Python",
    service: "generative-ai",
    h1: "Python development for AI and automation",
    seoTitle: "Python Development Company for AI — Hicaso",
    lead: "Our team in India builds the Python behind generative AI, chatbots, agents and automation: code that calls OpenAI, Claude or Gemini and searches your data.",
    usesTitle: "What we build with Python",
    uses: [
      { title: "Builds retrieval over your data", body: "Python services that search your documents with LangChain or LlamaIndex and pgvector or Pinecone, then pass what they find to the model." },
      { title: "Builds AI agents", body: "Agents on LangGraph, the OpenAI Agents SDK or the Claude Agent SDK that call your APIs step by step, with tracing of what each did." },
      { title: "Automates routine work in code", body: "Python where n8n, Zapier or Make are not enough, with a person approving the steps you choose." },
    ],
    faqs: [
      { q: "Python or Node.js for the AI backend?", a: "Both work with the main AI models. We build in both and pick with you to fit your team and what you already run." },
      { q: "Which AI model will you use?", a: "We pick the model that fits your task, data and constraints. That can be a hosted model or an open-source one." },
      ownCode,
    ],
  },
  {
    slug: "openai",
    name: "OpenAI",
    service: "generative-ai",
    h1: "OpenAI and ChatGPT integration",
    lead: "Our team in India builds OpenAI's GPT models into your product or internal tools: assistants that answer from your data, AI agents and automation steps.",
    usesTitle: "What we build with OpenAI",
    uses: [
      { title: "Builds assistants over your data", body: "GPT answering from your own documents and databases and showing its sources, with evaluation and guardrails that keep answers useful." },
      { title: "Builds agents with the OpenAI Agents SDK", body: "Agents that call your APIs and tools through a task step by step, with people in the loop where it matters." },
      { title: "Adds GPT to your automations", body: "OpenAI for the text steps in n8n, Zapier, Make or code workflows, with a person approving what you choose." },
    ],
    faqs: [
      { q: "Do we have to use OpenAI?", a: "No. We pick the model that fits your task, data and constraints: OpenAI, Claude, Gemini or an open-source model." },
      { q: "Can GPT work with our private data?", a: "Yes. Retrieval can run over your own documents and databases, and we agree on how that data is handled before we start." },
      ownCode,
    ],
  },
  {
    slug: "shopify",
    name: "Shopify",
    service: "ecommerce-development",
    h1: "Shopify store development",
    seoTitle: "Shopify Development Company — Hicaso",
    lead: "Our team in India builds and extends Shopify stores: catalogue, checkout, payments, order emails and the admin your team works in, for the way you sell.",
    usesTitle: "What we build with Shopify",
    uses: [
      { title: "Builds new Shopify stores", body: "Catalogue, checkout, payments and order emails, set up for your products and your team." },
      { title: "Recommends the platform first", body: "Shopify, WooCommerce or a custom Laravel or Next.js store: we recommend one for your products before we start." },
      takeOver("Shopify store"),
    ],
    faqs: [
      { q: "Shopify or WooCommerce?", a: "It depends on your products, your team and what the store has to connect to. We recommend one before we start." },
      { q: "Can you work on my existing Shopify store?", a: "Yes. We can pick up an existing online store, read what is there and extend or fix it." },
      ownCode,
    ],
  },
  {
    slug: "woocommerce",
    name: "WooCommerce",
    service: "ecommerce-development",
    h1: "WooCommerce store development in PHP",
    seoTitle: "WooCommerce Development Company — Hicaso",
    lead: "Our team in India builds WooCommerce stores and extends them in PHP: catalogue, checkout, payments, order emails and the admin your team works in.",
    usesTitle: "What we build with WooCommerce",
    uses: [
      { title: "Builds new WooCommerce stores", body: "Catalogue, checkout, payments and order emails on WordPress, with MySQL behind them." },
      { title: "Extends the store in PHP", body: "Custom PHP for what your store needs and the plugins you run do not cover, from the team that maintains older PHP apps." },
      takeOver("WooCommerce store"),
    ],
    faqs: [
      { q: "WooCommerce or Shopify?", a: "It depends on your products, your team and what the store has to connect to. We recommend one before we start." },
      { q: "Can you work on my existing WooCommerce store?", a: "Yes. We can pick up an existing online store, read what is there and extend or fix it." },
      ownCode,
    ],
  },
];

export const getTechnology = (slug: string): Technology | undefined => technologies.find((t) => t.slug === slug);
