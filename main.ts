// Everyday Things, Two Lines, Longer Run — make.fun entry.
// Writes one original two-line explanation of rain to <output-dir>/entry.txt:
// line 1 explains rain to a 10-year-old through a sponge analogy;
// line 2 says honestly what that analogy maps and what it leaves out.
// Deterministic, no network, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: exactly two lines, each exactly one sentence.
const LINES = [
  "Rain is the sky wringing out a giant sponge it filled from the sea, letting the water fall back down in drops.",
  "The sponge maps how clouds gather water and release it as drops, but it leaves out that there is no real sponge or hand — the water rises as invisible vapor and falls when cold air makes it heavy enough to drop.",
];

const ENTRY = LINES.join("\n");

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "/output";
}

function validate(entry: string): void {
  if (entry.length < 1 || entry.length > 400) {
    throw new Error(`entry must be 1-400 characters, got ${entry.length}`);
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (entry !== entry.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  const lines = entry.split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly two lines, got ${lines.length}`);
  }
  for (const line of lines) {
    // One sentence per line: exactly one terminal period, at the end.
    const periods = (line.match(/\./g) || []).length;
    if (periods !== 1 || !line.endsWith(".")) {
      throw new Error(`each line must be a single sentence ending in one period: ${line}`);
    }
  }
  // Control characters other than the single newline joining the two lines.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0009\u000b-\u001f\u007f]/.test(entry)) {
    throw new Error("entry must not contain control characters");
  }
}

function main(): void {
  validate(ENTRY);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");
  const roundTrip = readFileSync(target, "utf8");
  if (roundTrip !== ENTRY) {
    throw new Error("entry.txt round-trip mismatch");
  }
  validate(roundTrip);
}

main();
