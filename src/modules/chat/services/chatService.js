const mongoose = require("mongoose");
const Prompt = require("../models/Prompt");
const { buildSystemPrompt } = require("../assistantSystemPrompt");
const { generateAssistantReply } = require("../../ml/assistantModelService");

const MAX_HISTORY_MESSAGES = 10;

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((entry) => entry && typeof entry.content === "string")
    .map((entry) => ({
      role: entry.role === "assistant" ? "assistant" : "user",
      content: entry.content.trim(),
    }))
    .filter((entry) => entry.content.length > 0)
    .slice(-MAX_HISTORY_MESSAGES);
}

function sanitizeContext(context) {
  if (!context || typeof context !== "object") return {};
  const allowed = [
    "mode",
    "page",
    "route",
    "language",
    "course",
    "lessonId",
    "lessonTitle",
    "chapter",
    "tab",
    "code",
    "error",
    "challengeDescription",
  ];
  const out = {};
  for (const key of allowed) {
    if (context[key] != null && String(context[key]).trim()) {
      out[key] = String(context[key]).slice(0, key === "code" ? 4000 : 2000);
    }
  }
  return out;
}

function buildGroqMessages(history, userMessage, context = {}) {
  const messages = [
    { role: "system", content: buildSystemPrompt(sanitizeContext(context)) },
  ];

  for (const entry of history) {
    messages.push({ role: entry.role, content: entry.content });
  }

  messages.push({ role: "user", content: userMessage });
  return messages;
}

function likedToFeedback(liked) {
  if (liked === true) return "like";
  if (liked === false) return "dislike";
  return null;
}

function ratingToLiked(rating) {
  const normalized = String(rating || "").trim().toLowerCase();
  if (normalized === "like") return true;
  if (normalized === "dislike") return false;
  return null;
}

function promptsToMessages(prompts) {
  const messages = [];
  for (const prompt of prompts) {
    messages.push({
      role: "user",
      content: prompt.userMessage,
      createdAt: prompt.createdAt,
    });
    messages.push({
      role: "assistant",
      content: prompt.assistantMessage,
      createdAt: prompt.updatedAt || prompt.createdAt,
      clientMessageId: prompt.messageId,
      feedback: likedToFeedback(prompt.liked),
      liked: prompt.liked,
    });
  }
  return messages;
}

async function assertSessionAccess(sessionId, userId) {
  const owner = await Prompt.findOne({ sessionId, userId: { $ne: null } })
    .select("userId")
    .lean();

  if (
    owner?.userId &&
    userId &&
    String(owner.userId) !== String(userId)
  ) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
}

async function sendAssistantMessage({
  message,
  history = [],
  sessionId,
  userId = null,
  context = {},
  assistantMessageId = null,
}) {
  const trimmedMessage = String(message || "").trim();
  if (!trimmedMessage) {
    const err = new Error("Message is required.");
    err.statusCode = 400;
    throw err;
  }

  if (!sessionId) {
    const err = new Error("session_id is required.");
    err.statusCode = 400;
    throw err;
  }

  const normalizedHistory = normalizeHistory(history);
  const groqMessages = buildGroqMessages(
    normalizedHistory,
    trimmedMessage,
    context,
  );
  const reply = await generateAssistantReply(groqMessages);

  const messageId =
    String(assistantMessageId || "").trim() ||
    `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const prompt = await Prompt.create({
    userId: userId || null,
    sessionId: String(sessionId).trim(),
    messageId: messageId.slice(0, 64),
    userMessage: trimmedMessage,
    assistantMessage: reply,
    liked: null,
    context: sanitizeContext(context),
  });

  return {
    success: true,
    response: reply,
    promptId: prompt._id,
    assistantMessageId: messageId,
  };
}

async function submitAssistantFeedback({
  sessionId,
  messageId,
  rating,
  userMessage,
  assistantMessage,
  context = {},
  userId = null,
}) {
  const trimmedSessionId = String(sessionId || "").trim();
  const trimmedMessageId = String(messageId || "").trim();
  const liked = ratingToLiked(rating);

  if (!trimmedSessionId) {
    const err = new Error("session_id is required.");
    err.statusCode = 400;
    throw err;
  }
  if (!trimmedMessageId) {
    const err = new Error("message_id is required.");
    err.statusCode = 400;
    throw err;
  }
  if (liked === null) {
    const err = new Error('rating must be "like" or "dislike".');
    err.statusCode = 400;
    throw err;
  }

  const trimmedUserMessage = String(userMessage || "").trim();
  const trimmedAssistantMessage = String(assistantMessage || "").trim();
  if (!trimmedUserMessage || !trimmedAssistantMessage) {
    const err = new Error("user_message and assistant_message are required.");
    err.statusCode = 400;
    throw err;
  }

  await assertSessionAccess(trimmedSessionId, userId);

  const prompt = await Prompt.findOneAndUpdate(
    { sessionId: trimmedSessionId, messageId: trimmedMessageId },
    {
      $set: {
        liked,
        userMessage: trimmedUserMessage.slice(0, 8000),
        assistantMessage: trimmedAssistantMessage.slice(0, 8000),
        context: sanitizeContext(context),
        ...(userId ? { userId } : {}),
      },
      $setOnInsert: {
        sessionId: trimmedSessionId,
        messageId: trimmedMessageId,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return {
    success: true,
    liked: prompt.liked,
    rating: likedToFeedback(prompt.liked),
  };
}

async function getConversationBySession(sessionId, userId = null) {
  const trimmedSessionId = String(sessionId || "").trim();
  if (!trimmedSessionId) return null;

  await assertSessionAccess(trimmedSessionId, userId);

  const prompts = await Prompt.find({ sessionId: trimmedSessionId }).sort({
    createdAt: 1,
  });

  if (!prompts.length) return null;

  return {
    sessionId: trimmedSessionId,
    messages: promptsToMessages(prompts),
    updatedAt: prompts[prompts.length - 1].updatedAt,
  };
}

async function listUserConversations(userId) {
  if (!userId) return [];

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const rows = await Prompt.aggregate([
    { $match: { userId: userObjectId } },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$sessionId",
        messageCount: { $sum: 1 },
        lastPrompt: { $last: "$$ROOT" },
        updatedAt: { $max: "$updatedAt" },
        createdAt: { $min: "$createdAt" },
      },
    },
    { $sort: { updatedAt: -1 } },
    { $limit: 50 },
  ]);

  return rows.map((row) => ({
    sessionId: row._id,
    messageCount: row.messageCount,
    lastMessage: {
      role: "assistant",
      content: row.lastPrompt.assistantMessage,
      liked: row.lastPrompt.liked,
    },
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  }));
}

async function clearConversation(sessionId, userId = null) {
  const trimmedSessionId = String(sessionId || "").trim();
  if (!trimmedSessionId) return false;

  await assertSessionAccess(trimmedSessionId, userId);

  const result = await Prompt.deleteMany({ sessionId: trimmedSessionId });
  return result.deletedCount > 0;
}

module.exports = {
  sendAssistantMessage,
  submitAssistantFeedback,
  getConversationBySession,
  listUserConversations,
  clearConversation,
};
