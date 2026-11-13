import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_MAX_BYTES, IMAGE_MAX_PIXELS, readImage, saveImage, sniffImage } from "./images.ts";

const tmp = () => mkdtemp(path.join(os.tmpdir(), "hicaso-img-"));
const REFUSED = "Upload a PNG or JPEG image up to 3 MB.";

test("a saved image has a random name and no EXIF", async () => {
  const input = await sharp({ create: { width: 4, height: 4, channels: 3, background: "#2456d6" } })
    .withExif({ IFD0: { Copyright: "x" } })
    .png()
    .toBuffer();
  assert.ok((await sharp(input).metadata()).exif, "test input must carry EXIF");
  const dir = path.join(await tmp(), "nested");
  const r = await saveImage(input, dir);
  assert.ok(r.ok);
  assert.match(r.path, /^\/blog-images\/[a-f0-9]{32}\.png$/);
  const saved = await readFile(path.join(dir, path.basename(r.path)));
  assert.equal((await sharp(saved).metadata()).exif, undefined);
  assert.deepEqual(await readdir(dir), [path.basename(r.path)]);
  const back = await readImage(path.basename(r.path), dir);
  assert.equal(back?.type, "image/png");
});

test("a JPEG saves as .jpg", async () => {
  const input = await sharp({ create: { width: 4, height: 4, channels: 3, background: "#fff" } }).jpeg().toBuffer();
  const r = await saveImage(input, await tmp());
  assert.ok(r.ok);
  assert.match(r.path, /\.jpg$/);
});

test("bad uploads are refused and nothing is written", async () => {
  const dir = await tmp();
  const png = await sharp({ create: { width: 64, height: 64, channels: 3, background: "#000" } }).png().toBuffer();
  const cases = [
    Buffer.alloc(IMAGE_MAX_BYTES + 1),
    Buffer.from("GIF89a\x01\x00\x01\x00"),
    png.subarray(0, 40),
    Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  ];
  for (const b of cases) assert.deepEqual(await saveImage(b, dir), { ok: false, error: REFUSED });
  assert.deepEqual(await readdir(dir), []);
});

test("sniffImage reads magic bytes", () => {
  assert.equal(sniffImage(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0])), "png");
  assert.equal(sniffImage(Uint8Array.from([0xff, 0xd8, 0xff, 0])), "jpg");
  assert.equal(sniffImage(Uint8Array.from([1, 2, 3])), null);
});

test("readImage refuses bad names and missing files", async () => {
  const dir = await tmp();
  assert.equal(await readImage("../etc/passwd", dir), null);
  assert.equal(await readImage("x.png", dir), null);
  assert.equal(await readImage("a".repeat(32) + ".png", dir), null);
});

test("an image over the pixel limit is refused, a normal one accepted", async () => {
  const dir = await tmp();
  const solid = (width: number, height: number) =>
    sharp({ create: { width, height, channels: 3, background: "#2456d6" } }).png().toBuffer();
  assert.equal(IMAGE_MAX_PIXELS, 24_000_000);
  const big = await solid(6000, 4001);
  assert.ok(big.length < IMAGE_MAX_BYTES, "must fail on pixels, not size");
  assert.deepEqual(await saveImage(big, dir), { ok: false, error: REFUSED });
  assert.deepEqual(await readdir(dir), []);
  assert.ok((await saveImage(await solid(1600, 1000), dir)).ok);
});
