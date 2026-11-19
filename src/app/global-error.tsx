"use client"; // replaces the root layout when it fails, so it brings its own <html> and <body> and no kit styles

// Plain and readable without the site's CSS (global-error renders its own document: error.md).
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  console.error(error);
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", maxWidth: "36rem", margin: "15vh auto", padding: "0 1rem", lineHeight: 1.5 }}>
        <title>Hicaso: something went wrong</title>
        <h1>This page didn&apos;t load</h1>
        <p>Something went wrong on our side. Try again, or write to hello@hicaso.com.</p>
        <button type="button" onClick={() => retry()}>Try again</button>
      </body>
    </html>
  );
}
