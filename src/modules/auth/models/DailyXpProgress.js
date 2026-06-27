const mongoose = require("mongoose");

const dailyLessonSchema = new mongoose.Schema(
  {
    lessonId: { type: String, required: true },
    course: { type: String, default: "" },
    title: { type: String, default: "" },
    xp: { type: Number, default: 0 },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const dailyDaySchema = new mongoose.Schema(
  {
    dateKey: { type: String, required: true },
    lessons: { type: [dailyLessonSchema], default: [] },
    lessonXp: { type: Number, default: 0 },
    readBonusXp: { type: Number, default: 0 },
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { _id: false },
);

const dailyXpProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    days: {
      type: [dailyDaySchema],
      default: [],
    },
    totalXp: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DailyXpProgress", dailyXpProgressSchema);
