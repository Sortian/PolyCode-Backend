const Prompt = require("../models/Prompt");
const {
  isDriveConfigured,
  uploadDriveFile,
} = require("../../../services/googleDriveService");

function formatCleanPrompt(doc) {
  return {
    userMessage: doc.userMessage,
    assistantMessage: doc.assistantMessage,
    liked: doc.liked === true ? true : doc.liked === false ? false : null,
  };
}

async function fetchCleanPrompts(filters = {}) {
  const query = {};

  if (filters.userId) {
    query.userId = filters.userId;
  }
  if (filters.sessionId) {
    query.sessionId = String(filters.sessionId).trim();
  }
  if (filters.ratedOnly) {
    query.liked = { $ne: null };
  }
  if (filters.since) {
    const sinceDate = new Date(filters.since);
    if (!Number.isNaN(sinceDate.getTime())) {
      query.createdAt = { $gte: sinceDate };
    }
  }

  const limit = Math.min(Math.max(Number(filters.limit) || 5000, 1), 10000);

  const rows = await Prompt.find(query)
    .sort({ createdAt: 1 })
    .limit(limit)
    .select("userMessage assistantMessage liked createdAt")
    .lean();

  return rows.map(formatCleanPrompt);
}

function buildExportPayload(prompts) {
  return prompts;
}

async function exportPromptsToDrive(filters = {}) {
  if (!isDriveConfigured()) {
    const err = new Error(
      "Google Drive is not configured. Set GOOGLE_DRIVE_FOLDER_ID and OAuth or service account credentials.",
    );
    err.statusCode = 503;
    throw err;
  }

  const prompts = await fetchCleanPrompts(filters);
  const payload = buildExportPayload(prompts);
  const json = JSON.stringify(payload, null, 2);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `polycode-prompts-${stamp}.json`;

  const upload = await uploadDriveFile({
    buffer: Buffer.from(json, "utf8"),
    mimeType: "application/json",
    fileName,
  });

  return {
    success: true,
    count: prompts.length,
    fileName: upload.name,
    fileId: upload.fileId,
    webViewLink: upload.webViewLink,
    exportedAt: new Date().toISOString(),
  };
}

module.exports = {
  formatCleanPrompt,
  fetchCleanPrompts,
  buildExportPayload,
  exportPromptsToDrive,
};
