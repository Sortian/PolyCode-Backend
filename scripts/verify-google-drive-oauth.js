/**
 * Verify Google Drive OAuth without uploading a file.
 * Run from backend/: node scripts/verify-google-drive-oauth.js
 */
require("dotenv").config();
const {
  resolveRefreshToken,
  warnIfTokenMalformed,
  looksLikeGoogleRefreshToken,
  formatInvalidGrantHelp,
} = require("../src/services/googleOAuthStore");
const { verifyOAuthConnection, isDriveConfigured } = require("../src/services/googleDriveService");

async function main() {
  console.log("\n=== Google Drive OAuth check ===\n");

  if (!isDriveConfigured()) {
    console.error("Drive is not fully configured (client id/secret/token/folder).");
    process.exit(1);
  }

  const bundle = resolveRefreshToken();
  console.log(`Token source: ${bundle?.source || "none"}`);
  console.log(`Token prefix: ${bundle?.refresh_token?.slice(0, 8) || "(missing)"}...`);
  console.log(
    `Format OK: ${looksLikeGoogleRefreshToken(bundle?.refresh_token) ? "yes" : "NO — likely truncated"}`,
  );
  warnIfTokenMalformed(bundle?.refresh_token || "");

  const result = await verifyOAuthConnection();
  if (result.skipped) {
    console.log("OAuth mode not active (service account?).");
    process.exit(0);
  }

  if (result.ok) {
    console.log("\n✅ Refresh token works — access token obtained.\n");
    process.exit(0);
  }

  console.error("\n❌ OAuth check failed:\n");
  console.error(result.error || formatInvalidGrantHelp());
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
