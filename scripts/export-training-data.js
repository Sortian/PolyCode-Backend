#!/usr/bin/env node
/**
 * Export PolyMentor prompts from MongoDB into ML training files.
 *
 * Usage:
 *   npm run ml:export-training
 *   npm run ml:export-training -- --rated-only
 *   npm run ml:export-training -- --liked-only
 *   npm run ml:export-training -- --dry-run
 *
 * Output folder: backend/ml/exports/<timestamp>/
 *   - raw.json              userMessage, assistantMessage, liked
 *   - sft.jsonl             fine-tuning (liked=true by default)
 *   - preference.jsonl      DPO-style liked/disliked rows
 *   - stats.json            counts and summary
 */

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { connectToMongoDB } = require("../src/config/database");
const { buildTrainingExport } = require("../src/modules/ml/mlTrainingDataService");

function readArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function writeFile(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, "utf8");
}

async function main() {
  const ratedOnly = process.argv.includes("--rated-only");
  const likedOnly = process.argv.includes("--liked-only");
  const dislikedOnly = process.argv.includes("--disliked-only");
  const includeUnrated = process.argv.includes("--include-unrated");
  const since = readArg("--since");
  const dryRun = process.argv.includes("--dry-run");

  const filters = { ratedOnly, since };
  if (likedOnly) filters.likedOnly = true;
  if (dislikedOnly) filters.likedOnly = false;

  await connectToMongoDB();

  const dataset = await buildTrainingExport(filters, {
    includeUnrated,
    positiveOnly: !includeUnrated,
  });

  console.log("PolyMentor training export");
  console.log(JSON.stringify(dataset.stats, null, 2));

  if (dryRun) {
    console.log("\nDry run complete. No files written.");
    process.exit(0);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.join(__dirname, "..", "ml", "exports", stamp);

  writeFile(path.join(outDir, "raw.json"), JSON.stringify(dataset.raw, null, 2));
  writeFile(path.join(outDir, "sft.jsonl"), `${dataset.sftJsonl.join("\n")}\n`);
  writeFile(
    path.join(outDir, "preference.jsonl"),
    `${dataset.preferenceJsonl.join("\n")}\n`,
  );
  writeFile(
    path.join(outDir, "stats.json"),
    JSON.stringify(
      { ...dataset.stats, exportedAt: dataset.exportedAt },
      null,
      2,
    ),
  );

  console.log(`\nWrote training files to:\n  ${outDir}`);
  console.log(`  raw.json           ${dataset.raw.length} rows`);
  console.log(`  sft.jsonl          ${dataset.sftJsonl.length} lines`);
  console.log(`  preference.jsonl   ${dataset.preferenceJsonl.length} lines`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Training export failed:", err.message);
  process.exit(1);
});
