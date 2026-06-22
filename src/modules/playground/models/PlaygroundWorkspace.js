const mongoose = require("mongoose");

const playgroundWorkspaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    language: { type: String, required: true, trim: true, maxlength: 32 },
    driveFolderId: { type: String, required: true },
  },
  { timestamps: true },
);

playgroundWorkspaceSchema.index({ userId: 1, language: 1 }, { unique: true });

module.exports = mongoose.model("PlaygroundWorkspace", playgroundWorkspaceSchema);
