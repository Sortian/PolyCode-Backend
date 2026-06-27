const dailyXpService = require("../services/dailyXpService");

async function getDailyXp(req, res) {
  try {
    const data = await dailyXpService.getDailyXp(req.userId);
    res.json(data);
  } catch (error) {
    console.error("Get daily XP error:", error.message);
    res.status(400).json({ error: error.message });
  }
}

async function recordDailyXp(req, res) {
  try {
    const data = await dailyXpService.recordDailyXp(req.userId, req.body);
    res.json(data);
  } catch (error) {
    console.error("Record daily XP error:", error.message);
    res.status(400).json({ error: error.message });
  }
}

async function markDailyXpRead(req, res) {
  try {
    const { date } = req.body;
    const data = await dailyXpService.markDailyXpRead(req.userId, date);
    res.json(data);
  } catch (error) {
    console.error("Mark daily XP read error:", error.message);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getDailyXp,
  recordDailyXp,
  markDailyXpRead,
};
