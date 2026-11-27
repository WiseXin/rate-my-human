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
if ([...ENTRY].length > MAX_CHARS) {
  throw new Error(
    `entry is ${[...ENTRY].length} characters, over the ${MAX_CHARS} limit`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");
// Read it back: the file the judge reads must be exactly the line above.
if (readFileSync(outPath, "utf8") !== ENTRY + "\n") {
  throw new Error(`wrote ${outPath} but its bytes do not match the entry`);
}
console.log(ENTRY);
