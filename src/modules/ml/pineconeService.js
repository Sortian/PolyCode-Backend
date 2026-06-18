const { embedTexts } = require("./embeddingService");

function getPineconeConfig() {
  const apiKey = process.env.PINECONE_API_KEY?.trim();
  const indexHost = process.env.PINECONE_INDEX_HOST?.trim();
  const namespace = process.env.PINECONE_NAMESPACE?.trim() || "polymentor";

  if (!apiKey || !indexHost) {
    const err = new Error(
      "Pinecone is not configured. Set PINECONE_API_KEY and PINECONE_INDEX_HOST in backend/.env",
    );
    err.statusCode = 503;
    err.code = "PINECONE_NOT_CONFIGURED";
    throw err;
  }

  return { apiKey, indexHost, namespace };
}

function isPineconeConfigured() {
  return Boolean(
    process.env.PINECONE_API_KEY?.trim() &&
      process.env.PINECONE_INDEX_HOST?.trim(),
  );
}

async function upsertVectors(records, options = {}) {
  const { apiKey, indexHost, namespace } = getPineconeConfig();
  const batchSize = Math.min(Math.max(Number(options.batchSize) || 50, 1), 100);

  let upserted = 0;

  for (let offset = 0; offset < records.length; offset += batchSize) {
    const batch = records.slice(offset, offset + batchSize);
    const vectors = await embedTexts(batch.map((row) => row.text));

    const payload = {
      vectors: batch.map((row, index) => ({
        id: row.id,
        values: vectors[index],
        metadata: {
          userMessage: row.userMessage,
          assistantMessage: row.assistantMessage,
          liked: row.liked,
          createdAt: row.createdAt
            ? new Date(row.createdAt).toISOString()
            : null,
        },
      })),
      namespace,
    };

    const response = await fetch(`https://${indexHost}/vectors/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail =
        data?.message || data?.error || `Pinecone upsert failed (${response.status})`;
      const err = new Error(detail);
      err.statusCode = response.status;
      throw err;
    }

    upserted += batch.length;
  }

  return { upserted, namespace };
}

async function querySimilar(text, options = {}) {
  const { apiKey, indexHost, namespace } = getPineconeConfig();
  const topK = Math.min(Math.max(Number(options.topK) || 3, 1), 10);
  const [vector] = await embedTexts([text]);

  const response = await fetch(`https://${indexHost}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    },
    body: JSON.stringify({
      namespace,
      topK,
      vector,
      includeMetadata: true,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail =
      data?.message || data?.error || `Pinecone query failed (${response.status})`;
    const err = new Error(detail);
    err.statusCode = response.status;
    throw err;
  }

  return (data?.matches || []).map((match) => ({
    score: match.score,
    userMessage: match.metadata?.userMessage || "",
    assistantMessage: match.metadata?.assistantMessage || "",
    liked: match.metadata?.liked,
  }));
}

function buildRagContext(matches = []) {
  if (!matches.length) return "";

  const blocks = matches
    .filter((match) => match.assistantMessage)
    .map(
      (match, index) =>
        `Example ${index + 1} (score ${match.score?.toFixed?.(3) ?? "?"}):\nUser: ${match.userMessage}\nAssistant: ${match.assistantMessage}`,
    );

  if (!blocks.length) return "";

  return [
    "Here are similar past PolyMentor exchanges that users liked:",
    ...blocks,
  ].join("\n\n");
}

module.exports = {
  isPineconeConfigured,
  upsertVectors,
  querySimilar,
  buildRagContext,
};
