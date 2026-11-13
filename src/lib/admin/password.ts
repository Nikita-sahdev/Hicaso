import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const N = 16384;
const R = 8;
const P = 1;
const SALT_LEN = 16;
const KEY_LEN = 64;

function derive(pw: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(pw.normalize("NFKC"), salt, KEY_LEN, { N: n, r, p }, (e, key) => (e ? reject(e) : resolve(key))),
  );
}

// Format: scrypt$N$r$p$<salt b64>$<hash b64>
export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const key = await derive(pw, salt, N, R, P);
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

const INT = /^[1-9]\d{0,9}$/;
const B64 = /^[A-Za-z0-9+/]+={0,2}$/;

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const [, ns, rs, ps, saltB64, keyB64] = parts;
    if (!INT.test(ns) || !INT.test(rs) || !INT.test(ps)) return false;
    if (!B64.test(saltB64) || !B64.test(keyB64)) return false;
    const salt = Buffer.from(saltB64, "base64");
    const want = Buffer.from(keyB64, "base64");
    if (salt.length !== SALT_LEN || want.length !== KEY_LEN) return false;
    const got = await derive(pw, salt, Number(ns), Number(rs), Number(ps));
    return got.length === want.length && timingSafeEqual(got, want);
  } catch {
    return false; // invalid scrypt parameters, etc.
  }
}

// Verified when the account does not exist, so a wrong email costs as much as a wrong password.
export const DUMMY_HASH =
  "scrypt$16384$8$1$zf/qrfF9TZgRghGyKfX8bA==$0PTSPheTVWUd9iP6Xx5N9DIyV36PX/W08LRb7nDm+eGoQmMT4rwjIbiVrGXheKbbZ3dO9aPjE8nC1xWVoR6+6Q==";
