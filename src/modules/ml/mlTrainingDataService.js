const Prompt = require("../chat/models/Prompt");
const { buildSystemPrompt } = require("../chat/assistantSystemPrompt");

const SYSTEM_PROMPT = buildSystemPrompt({});

function normalizePromptRow(doc) {
  return {
    userMessage: String(doc.userMessage || "").trim(),
    assistantMessage: String(doc.assistantMessage || "").trim(),
    liked:
      doc.liked === true ? true : doc.liked === false ? false : null,
    createdAt: doc.createdAt || null,
  };
}

async function fetchPromptsForTraining(filters = {}) {
  const query = {};

  if (filters.userId) query.userId = filters.userId;
  if (filters.sessionId) {
    query.sessionId = String(filters.sessionId).trim();
  }
  if (filters.ratedOnly) {
    query.liked = { $ne: null };
  }
  if (filters.likedOnly === true) {
    query.liked = true;
  }
  if (filters.likedOnly === false) {
    query.liked = false;
  }
  if (filters.since) {
    const sinceDate = new Date(filters.since);
    if (!Number.isNaN(sinceDate.getTime())) {
      query.createdAt = { $gte: sinceDate };
    }
  }

  const limit = Math.min(Math.max(Number(filters.limit) || 10000, 1), 50000);

  const rows = await Prompt.find(query)
    .sort({ createdAt: 1 })
    .limit(limit)
    .select("userMessage assistantMessage liked createdAt")
    .lean();

  return rows.map(normalizePromptRow).filter(
    (row) => row.userMessage && row.assistantMessage,
  );
}

function summarizePrompts(prompts) {
  const stats = {
    total: prompts.length,
    liked: 0,
    disliked: 0,
    unrated: 0,
    sftCandidates: 0,
    preferenceCandidates: 0,
  };

  for (const row of prompts) {
    if (row.liked === true) {
      stats.liked += 1;
      stats.sftCandidates += 1;
      stats.preferenceCandidates += 1;
    } else if (row.liked === false) {
      stats.disliked += 1;
      stats.preferenceCandidates += 1;
    } else {
      stats.unrated += 1;
    }
  }

  return stats;
}

/**
 * OpenAI / Groq / HuggingFace chat fine-tuning JSONL.
 * By default only includes liked=true (high-quality answers).
 */
function buildSftJsonlLines(prompts, options = {}) {
  const includeUnrated = options.includeUnrated === true;
  const lines = [];

  for (const row of prompts) {
    if (row.liked === false) continue;
    if (!includeUnrated && row.liked !== true) continue;

    lines.push(
      JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: row.userMessage },
          { role: "assistant", content: row.assistantMessage },
        ],
        metadata: {
          liked: row.liked,
          createdAt: row.createdAt,
        },
      }),
    );
  }

  return lines;
}

/**
 * Preference format for DPO / RLHF-style training.
 * liked=true  → chosen response
 * liked=false → rejected response
 */
function buildPreferenceJsonlLines(prompts) {
  const lines = [];

  for (const row of prompts) {
    if (row.liked !== true && row.liked !== false) continue;

    lines.push(
      JSON.stringify({
        prompt: row.userMessage,
        chosen: row.liked === true ? row.assistantMessage : null,
        rejected: row.liked === false ? row.assistantMessage : null,
        liked: row.liked,
        createdAt: row.createdAt,
      }),
    );
  }

  return lines.filter((line) => {
    const parsed = JSON.parse(line);
    return parsed.chosen || parsed.rejected;
  });
}

function buildRawExport(prompts) {
  return prompts.map(({ userMessage, assistantMessage, liked }) => ({
    userMessage,
    assistantMessage,
    liked,
  }));
}

function buildPineconeRecords(prompts, options = {}) {
  const positiveOnly = options.positiveOnly !== false;

  return prompts
    .filter((row) => (positiveOnly ? row.liked === true : row.liked !== false))
    .map((row, index) => ({
      id: `prompt-${index}-${Date.now()}`,
      userMessage: row.userMessage,
      assistantMessage: row.assistantMessage,
      liked: row.liked,
      text: `User: ${row.userMessage}\nAssistant: ${row.assistantMessage}`,
      createdAt: row.createdAt,
    }));
}

async function buildTrainingExport(filters = {}, options = {}) {
  const prompts = await fetchPromptsForTraining(filters);
  const stats = summarizePrompts(prompts);

  return {
    stats,
    raw: buildRawExport(prompts),
    sftJsonl: buildSftJsonlLines(prompts, options),
    preferenceJsonl: buildPreferenceJsonlLines(prompts),
    pineconeRecords: buildPineconeRecords(prompts, options),
    exportedAt: new Date().toISOString(),
  };
}

module.exports = {
  SYSTEM_PROMPT,
  normalizePromptRow,
  fetchPromptsForTraining,
  summarizePrompts,
  buildSftJsonlLines,
  buildPreferenceJsonlLines,
  buildRawExport,
  buildPineconeRecords,
  buildTrainingExport,
};
