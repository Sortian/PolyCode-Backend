const mongoose = require("mongoose");

const playgroundFileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    language: { type: String, required: true, trim: true, maxlength: 32 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    driveFileId: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

playgroundFileSchema.index({ userId: 1, language: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("PlaygroundFile", playgroundFileSchema);
