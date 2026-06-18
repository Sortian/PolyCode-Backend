const { buildTrainingExport } = require("../ml/mlTrainingDataService");

async function getTrainingStats(req, res) {
  try {
    const { ratedOnly, likedOnly, since, limit } = req.query || {};
    const dataset = await buildTrainingExport(
      {
        ratedOnly: ratedOnly === "true" || ratedOnly === "1",
        likedOnly:
          likedOnly === "true" || likedOnly === "1"
            ? true
            : likedOnly === "false" || likedOnly === "0"
              ? false
              : undefined,
        since,
        limit,
      },
      { includeUnrated: req.query?.includeUnrated === "true" },
    );

    return res.json({
      stats: dataset.stats,
      exportedAt: dataset.exportedAt,
      formats: {
        raw: dataset.raw.length,
        sftJsonl: dataset.sftJsonl.length,
        preferenceJsonl: dataset.preferenceJsonl.length,
        pineconeRecords: dataset.pineconeRecords.length,
      },
      sample: dataset.raw.slice(0, 3),
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      error: error.message || "Failed to build training stats.",
      success: false,
    });
  }
}

module.exports = { getTrainingStats };
