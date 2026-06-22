const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { google } = require("googleapis");

const DRIVE_FILE_SCOPE = "https://www.googleapis.com/auth/drive.file";

function useOAuthMode() {
  return Boolean(
    process.env.GOOGLE_DRIVE_OAUTH_CLIENT_ID?.trim() &&
      process.env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET?.trim() &&
      process.env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN?.trim(),
  );
}

function loadServiceAccountCredentials() {
  const jsonPath = process.env.GOOGLE_DRIVE_CREDENTIALS_PATH?.trim();
  if (jsonPath) {
    const absolutePath = path.isAbsolute(jsonPath)
      ? jsonPath
      : path.resolve(process.cwd(), jsonPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(
        `GOOGLE_DRIVE_CREDENTIALS_PATH file not found: ${absolutePath}`,
      );
    }
    const parsed = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key,
    };
  }

  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  return {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  };
}

function hasServiceAccountCreds() {
  return Boolean(loadServiceAccountCredentials());
}

function getOAuthDriveClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_OAUTH_CLIENT_ID.trim(),
    process.env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET.trim(),
    process.env.GOOGLE_DRIVE_OAUTH_REDIRECT_URI?.trim() ||
      "http://localhost:3333/oauth2callback",
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN.trim(),
  });

  return google.drive({ version: "v3", auth: oauth2Client });
}

function getServiceAccountDriveClient() {
  const credentials = loadServiceAccountCredentials();
  if (!credentials) {
    throw new Error("Service account credentials are not configured.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: [DRIVE_FILE_SCOPE],
  });

  return google.drive({ version: "v3", auth });
}

function getDriveClient() {
  if (useOAuthMode()) {
    return { drive: getOAuthDriveClient(), mode: "oauth" };
  }
  return { drive: getServiceAccountDriveClient(), mode: "service_account" };
}

function isDriveConfigured() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim();
  if (!folderId) return false;
  return useOAuthMode() || hasServiceAccountCreds();
}

function formatDriveError(error) {
  const message = error?.message || "";
  const responseError = error?.response?.data?.error || "";

  if (
    message.includes("invalid_grant") ||
    responseError === "invalid_grant"
  ) {
    return (
      "Google Drive OAuth refresh token is invalid or expired. " +
      "Re-run: node scripts/google-drive-oauth-setup.js — sign in, copy the new " +
      "GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN into .env, restart the backend, then export again. " +
      "Ensure CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN are from the same OAuth setup."
    );
  }
  if (
    message.includes("storage quota") ||
    message.includes("Service Accounts do not have")
  ) {
    return (
      "Personal Gmail cannot store files with a service account. " +
      "Use OAuth instead: run `node scripts/google-drive-oauth-setup.js` and add " +
      "GOOGLE_DRIVE_OAUTH_* variables to .env (see .env.example)."
    );
  }
  return message || "Google Drive upload failed.";
}

/**
 * Upload a profile image buffer to Google Drive.
 * @returns {Promise<{ url: string, fileId: string }>}
 */
async function uploadProfileImage({ buffer, mimeType, fileName }) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim();
  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is required.");
  }

  const { drive, mode } = getDriveClient();

  const createParams = {
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id, webViewLink",
  };

  if (mode === "service_account") {
    createParams.supportsAllDrives = true;
  }

  let file;
  try {
    file = await drive.files.create(createParams);
  } catch (error) {
    throw new Error(formatDriveError(error));
  }

  const fileId = file.data.id;

  // Public permission is optional — avatars are served via /api/auth/user/:id/avatar.
  drive.permissions
    .create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
      ...(mode === "service_account" ? { supportsAllDrives: true } : {}),
    })
    .catch((permissionError) => {
      console.warn("Drive: public permission skipped:", permissionError.message);
    });

  const url = buildDriveThumbnailUrl(fileId);
  return { url, fileId, webViewLink: file.data.webViewLink || url };
}

function buildDriveThumbnailUrl(fileId) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
}

/**
 * Upload a JSON or text file to Google Drive.
 * @returns {Promise<{ fileId: string, webViewLink: string, name: string }>}
 */
async function uploadDriveFile({ buffer, mimeType, fileName, folderId }) {
  const parentId =
    folderId?.trim() ||
    process.env.GOOGLE_DRIVE_PROMPTS_FOLDER_ID?.trim() ||
    process.env.GOOGLE_DRIVE_FOLDER_ID?.trim();

  if (!parentId) {
    throw new Error(
      "GOOGLE_DRIVE_FOLDER_ID or GOOGLE_DRIVE_PROMPTS_FOLDER_ID is required.",
    );
  }

  const { drive, mode } = getDriveClient();

  const createParams = {
    requestBody: {
      name: fileName,
      parents: [parentId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id, webViewLink, name",
  };

  if (mode === "service_account") {
    createParams.supportsAllDrives = true;
  }

  let file;
  try {
    file = await drive.files.create(createParams);
  } catch (error) {
    throw new Error(formatDriveError(error));
  }

  return {
    fileId: file.data.id,
    webViewLink: file.data.webViewLink || buildDriveThumbnailUrl(file.data.id),
    name: file.data.name || fileName,
  };
}

async function streamDriveFile(fileId) {
  const { drive, mode } = getDriveClient();
  const getParams = { fileId, fields: "mimeType" };
  if (mode === "service_account") {
    getParams.supportsAllDrives = true;
  }

  const meta = await drive.files.get(getParams);
  const mediaParams = { fileId, alt: "media" };
  if (mode === "service_account") {
    mediaParams.supportsAllDrives = true;
  }

  const response = await drive.files.get(mediaParams, { responseType: "stream" });
  return {
    stream: response.data,
    mimeType: meta.data.mimeType || "image/jpeg",
  };
}

async function readDriveFileAsString(fileId) {
  const { stream } = await streamDriveFile(fileId);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function findDriveFolder({ name, parentId }) {
  const { drive, mode } = getDriveClient();
  const safeName = String(name).replace(/'/g, "\\'");
  const listParams = {
    q: `name='${safeName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
    pageSize: 1,
  };
  if (mode === "service_account") {
    listParams.supportsAllDrives = true;
  }
  const list = await drive.files.list(listParams);
  return list.data.files?.[0]?.id || null;
}

async function ensureDriveFolder({ name, parentId }) {
  const existing = await findDriveFolder({ name, parentId });
  if (existing) return existing;

  const { drive, mode } = getDriveClient();
  const createParams = {
    requestBody: {
      name: String(name).slice(0, 120),
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  };
  if (mode === "service_account") {
    createParams.supportsAllDrives = true;
  }

  try {
    const folder = await drive.files.create(createParams);
    return folder.data.id;
  } catch (error) {
    throw new Error(formatDriveError(error));
  }
}

async function updateDriveFileContent({
  fileId,
  buffer,
  mimeType = "text/plain",
}) {
  const { drive, mode } = getDriveClient();
  const params = {
    fileId,
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id, modifiedTime",
  };
  if (mode === "service_account") {
    params.supportsAllDrives = true;
  }

  try {
    const result = await drive.files.update(params);
    return result.data;
  } catch (error) {
    throw new Error(formatDriveError(error));
  }
}

async function deleteDriveFile(fileId) {
  const { drive, mode } = getDriveClient();
  const params = { fileId };
  if (mode === "service_account") {
    params.supportsAllDrives = true;
  }

  try {
    await drive.files.delete(params);
  } catch (error) {
    throw new Error(formatDriveError(error));
  }
}

module.exports = {
  uploadProfileImage,
  uploadDriveFile,
  streamDriveFile,
  readDriveFileAsString,
  ensureDriveFolder,
  updateDriveFileContent,
  deleteDriveFile,
  buildDriveThumbnailUrl,
  isDriveConfigured,
  useOAuthMode,
};
