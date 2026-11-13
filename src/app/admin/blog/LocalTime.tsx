"use client";

import { useEffect, useState } from "react";

// Formats in the browser's own time zone; the server render shows the UTC date.
export default function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState(iso.slice(0, 10));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }));
  }, [iso]);
  return <time dateTime={iso}>{text}</time>;
}
