const express = require("express");
const rateLimit = require("express-rate-limit");
const optionalAuth = require("../../middleware/optionalAuth");
const requireAuth = require("../../middleware/requireAuth");
const requireExportSecret = require("../../middleware/requireExportSecret");
const chatController = require("./controllers/chatController");
const mlController = require("../ml/mlController");

const router = express.Router();

const assistantRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.ASSISTANT_RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a moment before sending another message.",
    success: false,
  },
});

router.post(
  "/assistant",
  assistantRateLimit,
  optionalAuth,
  chatController.assistantChat,
);

router.get(
  "/assistant/session/:sessionId",
  optionalAuth,
  chatController.getAssistantSession,
);

router.delete(
  "/assistant/session/:sessionId",
  optionalAuth,
  chatController.clearAssistantSession,
);

router.post(
  "/assistant/feedback",
  assistantRateLimit,
  optionalAuth,
  chatController.submitAssistantFeedback,
);

router.get("/conversations", requireAuth, chatController.listConversations);

router.get(
  "/prompts",
  requireExportSecret,
  chatController.listPromptsExport,
);

router.post(
  "/prompts/export-drive",
  requireExportSecret,
  chatController.exportPromptsToDrive,
);

router.get(
  "/ml/training-stats",
  requireExportSecret,
  mlController.getTrainingStats,
);

module.exports = router;
