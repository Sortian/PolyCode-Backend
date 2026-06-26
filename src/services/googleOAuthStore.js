const fs = require("fs");
const path = require("path");

const DEFAULT_TOKEN_PATH = path.resolve(
  process.cwd(),
  process.env.GOOGLE_DRIVE_OAUTH_TOKEN_PATH?.trim() ||
    "secrets/google-oauth-tokens.json",
);

/** Google refresh tokens almost always start with "1//". */
function looksLikeGoogleRefreshToken(token = "") {
  const value = String(token).trim();
  return /^1\/\//.test(value) && value.length >= 40;
}

function warnIfTokenMalformed(token = "") {
  const value = String(token).trim();
  if (!value) return;

  if (value.startsWith("//")) {
    console.warn(
      "⚠️  GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN looks truncated (starts with //). " +
        "Copy the full token from the setup script — it must begin with 1//",
    );
    return;
  }

  if (!looksLikeGoogleRefreshToken(value)) {
    console.warn(
      "⚠️  GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN format looks unusual. " +
        "If Drive uploads fail, re-run: node scripts/google-drive-oauth-setup.js",
    );
  }
}

function readTokenFile(filePath = DEFAULT_TOKEN_PATH) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const refreshToken = parsed?.refresh_token?.trim();
    if (!refreshToken) return null;
    return {
      refresh_token: refreshToken,
      access_token: parsed.access_token?.trim() || undefined,
      expiry_date: parsed.expiry_date || undefined,
      updated_at: parsed.updated_at || undefined,
      path: filePath,
    };
  } catch (error) {
    console.warn("⚠️  Could not read Google OAuth token file:", error.message);
    return null;
  }
}

function writeTokenFile(
  tokens,
  filePath = DEFAULT_TOKEN_PATH,
  { merge = true } = {},
) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  const existing = merge ? readTokenFile(filePath) : null;
  const payload = {
    refresh_token:
      tokens.refresh_token?.trim() ||
      existing?.refresh_token ||
      process.env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN?.trim(),
    access_token: tokens.access_token?.trim() || existing?.access_token,
    expiry_date: tokens.expiry_date ?? existing?.expiry_date,
    updated_at: new Date().toISOString(),
  };

  if (!payload.refresh_token) {
    throw new Error("No refresh_token to save.");
  }

  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

function resolveRefreshToken() {
  const fromFile = readTokenFile();
  if (fromFile?.refresh_token) {
    return {
      refresh_token: fromFile.refresh_token,
      access_token: fromFile.access_token,
      expiry_date: fromFile.expiry_date,
      source: "file",
      path: fromFile.path,
    };
  }

  const fromEnv = process.env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN?.trim();
  if (fromEnv) {
    return { refresh_token: fromEnv, source: "env" };
  }

  return null;
}

function hasOAuthClientConfig() {
  return Boolean(
    process.env.GOOGLE_DRIVE_OAUTH_CLIENT_ID?.trim() &&
      process.env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET?.trim(),
  );
}

function isOAuthConfigured() {
  return hasOAuthClientConfig() && Boolean(resolveRefreshToken()?.refresh_token);
}

function formatInvalidGrantHelp() {
  return (
    "Google Drive OAuth refresh token is invalid or expired.\n" +
    "Common causes:\n" +
    "  • Token copied without the leading 1// (must start with 1//)\n" +
    "  • OAuth app still in Testing mode (tokens expire after ~7 days)\n" +
    "  • CLIENT_ID / CLIENT_SECRET / REFRESH_TOKEN from different OAuth clients\n" +
    "  • Production .env not updated after local re-auth\n\n" +
    "Fix: from backend/ run  node scripts/google-drive-oauth-setup.js\n" +
    "Sign in, allow access, then restart the backend. The script saves\n" +
    "secrets/google-oauth-tokens.json automatically.\n\n" +
    "Permanent fix: Google Cloud Console → OAuth consent screen → Publish app\n" +
    "(Production) so refresh tokens stop expiring every week."
  );
}

module.exports = {
  DEFAULT_TOKEN_PATH,
  looksLikeGoogleRefreshToken,
  warnIfTokenMalformed,
  readTokenFile,
  writeTokenFile,
  resolveRefreshToken,
  hasOAuthClientConfig,
  isOAuthConfigured,
  formatInvalidGrantHelp,
};
