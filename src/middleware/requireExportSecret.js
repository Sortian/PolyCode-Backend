/**
 * Protects prompt export endpoints (header or query secret).
 * Set PROMPTS_EXPORT_SECRET in .env
 */
function requireExportSecret(req, res, next) {
  const expected = process.env.PROMPTS_EXPORT_SECRET?.trim();
  if (!expected) {
    return res.status(503).json({
      error: "PROMPTS_EXPORT_SECRET is not configured on the server.",
      success: false,
    });
  }

  const provided =
    req.headers["x-export-secret"] ||
    req.headers["x-prompts-export-secret"] ||
    req.query.secret;

  if (provided && String(provided) === expected) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized", success: false });
}

module.exports = requireExportSecret;
