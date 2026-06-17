const mongoose = require("mongoose");

/**
 * One document per user ↔ assistant exchange.
 * Collection name: prompts (only store for PolyMentor chat + feedback).
 */
const promptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
      index: true,
    },
    messageId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },
    userMessage: {
      type: String,
      required: true,
      maxlength: 8000,
    },
    assistantMessage: {
      type: String,
      required: true,
      maxlength: 8000,
    },
    /** true = like, false = dislike, null = not rated yet */
    liked: {
      type: Boolean,
      default: null,
    },
    context: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "prompts",
  },
);

promptSchema.index({ sessionId: 1, messageId: 1 }, { unique: true });
promptSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Prompt", promptSchema);
