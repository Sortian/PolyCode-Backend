const User = require("../models/User");
const UserProgress = require("../models/UserProgress");
const OopsCppProgress = require("../models/OopsCppProgress");
const dailyXpService = require("./dailyXpService");

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function isValidUsername(username) {
  return /^[a-z0-9_][a-z0-9_.-]{2,29}$/.test(username);
}

function serializeDoc(doc) {
  if (!doc) return null;
  if (typeof doc.toObject === "function") {
    const value = doc.toObject({ versionKey: false });
    delete value.__v;
    return value;
  }
  return doc;
}

function buildSummary({ user, languageProgress, oopsCppProgress, dailyXp }) {
  const languages = languageProgress || [];
  const oops = oopsCppProgress || {};

  return {
    languagesStarted: languages.length,
    languagesCompleted: languages.filter((entry) => entry.status === "completed")
      .length,
    languagesInProgress: languages.filter((entry) => entry.status === "in-progress")
      .length,
    totalMinutesSpent:
      languages.reduce((sum, entry) => sum + (entry.totalMinutesSpent || 0), 0) +
      (oops.totalMinutesSpent || 0),
    totalDocumentsCompleted: languages.reduce(
      (sum, entry) => sum + (entry.completedDocuments?.length || 0),
      0,
    ),
    completedLessonsCount: oops.completedLessons?.length || 0,
    oopsCppTotalXp: oops.totalXp || 0,
    dailyXpTotal: dailyXp?.totalXp || 0,
    currentStreak: Math.max(
      user?.currentStreak || 0,
      oops.currentStreak || 0,
      ...languages.map((entry) => entry.currentStreak || 0),
      0,
    ),
    highestStreak: user?.highestStreak || 0,
  };
}

/**
 * Aggregate PolyCode learning progress for a polycoder (username handle).
 * @param {string} username
 */
async function getProgressByUsername(username) {
  const polycoder = normalizeUsername(username);

  if (!isValidUsername(polycoder)) {
    const error = new Error("Polycoder not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findOne({ username: polycoder, isActive: true }).lean();

  if (!user) {
    const error = new Error("Polycoder not found");
    error.statusCode = 404;
    throw error;
  }

  const userId = user._id;

  const [languageProgress, oopsCppProgress, dailyXp] = await Promise.all([
    UserProgress.find({ userId }).lean(),
    OopsCppProgress.findOne({ userId }).lean(),
    dailyXpService.getDailyXp(userId),
  ]);

  const profile = {
    id: String(userId),
    username: user.username,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    preferredLanguages: user.preferredLanguages || [],
    currentStreak: user.currentStreak || 0,
    highestStreak: user.highestStreak || 0,
    lastLogin: user.lastLogin || null,
    createdAt: user.createdAt || null,
  };

  const summary = buildSummary({
    user,
    languageProgress,
    oopsCppProgress,
    dailyXp,
  });

  return {
    polycoder,
    userId: String(userId),
    profile,
    summary,
    languages: (languageProgress || []).map(serializeDoc),
    courses: {
      oopsCpp: serializeDoc(oopsCppProgress),
    },
    dailyXp,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  getProgressByUsername,
};
