import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const IMAGE_MAX_BYTES = 3_000_000;
export const IMAGE_FILE = /^[a-f0-9]{32}\.(png|jpg)$/;
const REFUSED = "Upload a PNG or JPEG image up to 3 MB.";

export function uploadsDir(): string {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
}

export function sniffImage(b: Uint8Array): "png" | "jpg" | null {
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  return null;
}

type Saved = { ok: true; path: string } | { ok: false; error: string };

// Re-encoding drops EXIF and anything else hidden in the upload (sharp strips metadata by default).
// The file name is generated here, never taken from the request, so nothing lands outside `dir`.
export async function saveImage(b: Buffer, dir: string): Promise<Saved> {
  const kind = b.length <= IMAGE_MAX_BYTES ? sniffImage(b) : null;
  if (!kind) return { ok: false, error: REFUSED };
  let out: Buffer;
  try {
    const img = sharp(b, { failOn: "error" }).rotate().resize({ width: 1600, withoutEnlargement: true });
    out = await (kind === "png" ? img.png() : img.jpeg({ quality: 85 })).toBuffer();
  } catch {
    return { ok: false, error: REFUSED };
  }
  const file = `${randomBytes(16).toString("hex")}.${kind}`;
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await writeFile(path.join(dir, file), out, { mode: 0o600, flag: "wx" });
  return { ok: true, path: `/blog-images/${file}` };
}

// null when the name is not one we generate or the file is missing; other read errors propagate.
export async function readImage(
  file: string,
  dir: string,
): Promise<{ body: Buffer; type: "image/png" | "image/jpeg" } | null> {
  if (!IMAGE_FILE.test(file)) return null;
  let body: Buffer;
  try {
    body = await readFile(path.join(dir, file));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
  const kind = sniffImage(body);
  if (!kind || !file.endsWith(`.${kind}`)) return null;
  return { body, type: kind === "png" ? "image/png" : "image/jpeg" };
}
