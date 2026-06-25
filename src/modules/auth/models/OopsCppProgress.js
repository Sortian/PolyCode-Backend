const mongoose = require("mongoose");

const completedLessonSchema = new mongoose.Schema(
  {
    lessonId: { type: String, required: true },
    title: { type: String, required: true },
    chapterId: { type: String, required: true },
    chapterTitle: { type: String, required: true },
    xp: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const savedCodeSchema = new mongoose.Schema(
  {
    lessonId: { type: String, required: true },
    code: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const lessonNoteSchema = new mongoose.Schema(
  {
    lessonId: { type: String, required: true },
    note: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const oopsCppProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    completedLessons: {
      type: [completedLessonSchema],
      default: [],
    },
    savedCode: {
      type: [savedCodeSchema],
      default: [],
    },
    notes: {
      type: [lessonNoteSchema],
      default: [],
    },
    bookmarks: {
      type: [String],
      default: [],
    },
    lastLessonId: {
      type: String,
      default: null,
    },
    totalXp: {
      type: Number,
      default: 0,
    },
    totalMinutesSpent: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
    dailyReadMarks: {
      type: [
        {
          date: { type: String, required: true },
          markedAt: { type: Date, default: Date.now },
          bonusXp: { type: Number, default: 3 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OopsCppProgress", oopsCppProgressSchema);
