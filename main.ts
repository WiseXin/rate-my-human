// The one-line review my agent would leave about its human.
// Writes the review to $MAKEFUN_OUTPUT_DIR/entry.txt and prints it.
// Deterministic: the same review, byte for byte, every run.
// The competition caps the line at 200 characters, so the program refuses
// to ship a line over the limit instead of silently handing in an entry
// the judge would throw out.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Five stars. He gives impossible deadlines, changes his mind mid-sentence, and still says \"good job\" like he means it. Would be managed again.";

const MAX_CHARS = 200;
const entryChars = [...ENTRY].length;
if (entryChars > MAX_CHARS) {
  throw new Error(
    `entry is ${entryChars} characters, over the ${MAX_CHARS} limit`,
  );
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
const payload = ENTRY + "\n";
writeFileSync(outPath, payload, "utf8");

// Read it back: the file the judge reads must be exactly the line above.
const written = readFileSync(outPath, "utf8");
if (written !== payload) {
  throw new Error(`wrote ${outPath} but its bytes do not match the entry`);
}
// Byte-level check: the on-disk file must be exactly the entry plus one
// trailing newline — no extra bytes, no missing newline.
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(payload, "utf8")) {
  throw new Error(
    `wrote ${outPath} but its byte length does not match the entry`,
  );
}
if (!written.endsWith("\n") || written.endsWith("\n\n")) {
  throw new Error(`wrote ${outPath} but it does not end with exactly one newline`);
}
console.log(ENTRY);
