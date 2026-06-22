const mongoose = require("mongoose");

const outputLineSchema = new mongoose.Schema(
  {
    type: { type: String, default: "stdout" },
    text: { type: String, default: "" },
  },
  { _id: false },
);

const playgroundRunSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    language: { type: String, required: true, trim: true, maxlength: 32 },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaygroundFile",
      default: null,
    },
    fileName: { type: String, default: "", maxlength: 120 },
    output: { type: [outputLineSchema], default: [] },
    previewHTML: { type: String, default: null },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: true },
);

playgroundRunSchema.index({ userId: 1, language: 1, createdAt: -1 });

module.exports = mongoose.model("PlaygroundRun", playgroundRunSchema);
