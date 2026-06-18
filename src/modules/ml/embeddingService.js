const OPENAI_EMBED_URL = "https://api.openai.com/v1/embeddings";

function getEmbeddingConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model =
    process.env.OPENAI_EMBEDDING_MODEL?.trim() || "text-embedding-3-small";

  if (!apiKey) {
    const err = new Error(
      "OPENAI_API_KEY is required for embeddings. Add it to backend/.env or use another embedding provider later.",
    );
    err.statusCode = 503;
    err.code = "EMBEDDINGS_NOT_CONFIGURED";
    throw err;
  }

  return { apiKey, model };
}

/**
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
async function embedTexts(texts) {
  const { apiKey, model } = getEmbeddingConfig();
  const input = texts.map((text) => String(text || "").slice(0, 8000));

  const response = await fetch(OPENAI_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      data?.error?.message ||
      data?.message ||
      `Embedding API failed (${response.status})`;
    const err = new Error(detail);
    err.statusCode = response.status;
    throw err;
  }

  const vectors = (data?.data || [])
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);

  if (vectors.length !== input.length) {
    throw new Error("Embedding API returned an unexpected vector count.");
  }

  return vectors;
}

module.exports = { embedTexts, getEmbeddingConfig };
