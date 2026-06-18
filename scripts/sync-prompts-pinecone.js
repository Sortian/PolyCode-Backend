#!/usr/bin/env node
/**
 * Sync liked PolyMentor prompts into Pinecone for RAG retrieval.
 *
 * Usage:
 *   npm run ml:sync-pinecone
 *   npm run ml:sync-pinecone -- --dry-run
 *
 * Requires:
 *   MONGODB_URI
 *   PINECONE_API_KEY
 *   PINECONE_INDEX_HOST   e.g. your-index-xxxx.svc.region.pinecone.io
 *   OPENAI_API_KEY        for embeddings (text-embedding-3-small)
 */

require("dotenv").config();
const { connectToMongoDB } = require("../src/config/database");
const { buildTrainingExport } = require("../src/modules/ml/mlTrainingDataService");
const { upsertVectors } = require("../src/modules/ml/pineconeService");

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  await connectToMongoDB();

  const dataset = await buildTrainingExport(
    { likedOnly: true },
    { positiveOnly: true },
  );

  const records = dataset.pineconeRecords.map((row, index) => ({
    ...row,
    id: `polymentor-${index}-${Date.parse(row.createdAt) || Date.now()}`,
  }));

  console.log(`Pinecone sync candidates: ${records.length}`);
  console.log(JSON.stringify(dataset.stats, null, 2));

  if (dryRun) {
    console.log("\nDry run complete. No vectors uploaded.");
    if (records[0]) {
      console.log("\nSample record:");
      console.log(JSON.stringify(records[0], null, 2));
    }
    process.exit(0);
  }

  const result = await upsertVectors(records);
  console.log(`\nUpserted ${result.upserted} vector(s) into namespace "${result.namespace}".`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Pinecone sync failed:", err.message);
  process.exit(1);
});
