#!/usr/bin/env node
/**
 * Fetch prompts from MongoDB and upload clean JSON to Google Drive.
 *
 * Usage:
 *   node scripts/export-prompts-to-drive.js
 *   node scripts/export-prompts-to-drive.js --rated-only
 *   node scripts/export-prompts-to-drive.js --since 2026-06-01
 *
 * Requires: MONGODB_URI, Google Drive env vars (see .env.example)
 */

require("dotenv").config();
const { connectToMongoDB } = require("../src/config/database");
const {
  exportPromptsToDrive,
  fetchCleanPrompts,
  buildExportPayload,
} = require("../src/modules/chat/services/promptExportService");

function readArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

async function main() {
  const ratedOnly = process.argv.includes("--rated-only");
  const since = readArg("--since");
  const dryRun = process.argv.includes("--dry-run");

  await connectToMongoDB();

  if (dryRun) {
    const prompts = await fetchCleanPrompts({ ratedOnly, since });
    console.log(JSON.stringify(buildExportPayload(prompts), null, 2));
    console.log(`\nDry run: ${prompts.length} prompt(s), not uploaded.`);
    process.exit(0);
  }

  const result = await exportPromptsToDrive({ ratedOnly, since });
  console.log("Exported prompts to Google Drive:");
  console.log(`  count: ${result.count}`);
  console.log(`  file:  ${result.fileName}`);
  console.log(`  link:  ${result.webViewLink}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
