// ponytail: in-memory per-IP limit, per process and reset on restart; move to Redis if you run several instances.
export function rateLimit(max: number, windowMs: number): (key: string) => boolean {
  const hits = new Map<string, number[]>();
  return (key) => {
    const now = Date.now();
    if (hits.size > 10_000) hits.clear();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    return recent.length > max;
  };
}

// Apache appends the client it saw as the last x-forwarded-for entry; earlier entries are client-supplied.
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "local";
