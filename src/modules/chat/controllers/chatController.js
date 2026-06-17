const chatService = require("../services/chatService");
const promptExportService = require("../services/promptExportService");

function handleError(res, error, fallbackStatus = 500) {
  const statusCode = error.statusCode || fallbackStatus;
  const isDev = process.env.NODE_ENV !== "production";
  const isConfigError =
    error.code === "GROQ_NOT_CONFIGURED" ||
    /GROQ_API_KEY is not configured/i.test(error.message || "");

  let message = error.message;
  if (statusCode >= 500 && !isDev && !isConfigError) {
    message =
      "The assistant is temporarily unavailable. Please try again in a moment.";
  }

  return res.status(statusCode).json({ error: message, success: false });
}

async function assistantChat(req, res) {
  try {
    const {
      message,
      history = [],
      session_id: sessionId = "",
      context = {},
      assistant_message_id: assistantMessageId = "",
    } = req.body || {};

    const result = await chatService.sendAssistantMessage({
      message,
      history,
      sessionId: String(sessionId).trim(),
      userId: req.userId || null,
      context,
      assistantMessageId: String(assistantMessageId).trim() || null,
    });

    return res.json(result);
  } catch (error) {
    console.error("Assistant chat error:", error.message);
    return handleError(res, error, 502);
  }
}

async function getAssistantSession(req, res) {
  try {
    const sessionId = String(req.params.sessionId || "").trim();
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const conversation = await chatService.getConversationBySession(
      sessionId,
      req.userId || null,
    );

    if (!conversation) {
      return res.json({ sessionId, messages: [] });
    }

    return res.json({
      sessionId: conversation.sessionId,
      messages: conversation.messages,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    return handleError(res, error, 400);
  }
}

async function listConversations(req, res) {
  try {
    const conversations = await chatService.listUserConversations(req.userId);
    return res.json({
      conversations: conversations.map((c) => ({
        sessionId: c.sessionId,
        messageCount: c.messageCount,
        lastMessage: c.lastMessage,
        updatedAt: c.updatedAt,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    return handleError(res, error, 400);
  }
}

async function clearAssistantSession(req, res) {
  try {
    const sessionId = String(req.params.sessionId || "").trim();
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const cleared = await chatService.clearConversation(
      sessionId,
      req.userId || null,
    );

    if (!cleared) {
      return res.json({ success: true, cleared: false });
    }

    return res.json({ success: true, cleared: true });
  } catch (error) {
    return handleError(res, error, 400);
  }
}

async function submitAssistantFeedback(req, res) {
  try {
    const {
      session_id: sessionId = "",
      message_id: messageId = "",
      rating = "",
      user_message: userMessage = "",
      assistant_message: assistantMessage = "",
      context = {},
    } = req.body || {};

    const result = await chatService.submitAssistantFeedback({
      sessionId: String(sessionId).trim(),
      messageId: String(messageId).trim(),
      rating,
      userMessage,
      assistantMessage,
      context,
      userId: req.userId || null,
    });

    if (process.env.GOOGLE_DRIVE_AUTO_EXPORT_PROMPTS === "true") {
      promptExportService
        .exportPromptsToDrive({ since: new Date(Date.now() - 24 * 60 * 60 * 1000) })
        .catch((err) => {
          console.warn("Prompts auto-export to Drive skipped:", err.message);
        });
    }

    return res.json(result);
  } catch (error) {
    return handleError(res, error, 400);
  }
}

async function listPromptsExport(req, res) {
  try {
    const { userId, sessionId, ratedOnly, since, limit } = req.query || {};
    const prompts = await promptExportService.fetchCleanPrompts({
      userId,
      sessionId,
      ratedOnly: ratedOnly === "true" || ratedOnly === "1",
      since,
      limit,
    });

    return res.json(promptExportService.buildExportPayload(prompts));
  } catch (error) {
    return handleError(res, error, 400);
  }
}

async function exportPromptsToDrive(req, res) {
  try {
    const { userId, sessionId, ratedOnly, since, limit } = req.body || req.query || {};
    const result = await promptExportService.exportPromptsToDrive({
      userId,
      sessionId,
      ratedOnly: ratedOnly === true || ratedOnly === "true" || ratedOnly === "1",
      since,
      limit,
    });
    return res.json(result);
  } catch (error) {
    return handleError(res, error, 503);
  }
}

module.exports = {
  assistantChat,
  getAssistantSession,
  listConversations,
  clearAssistantSession,
  submitAssistantFeedback,
  listPromptsExport,
  exportPromptsToDrive,
};
