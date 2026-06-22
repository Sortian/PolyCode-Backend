const PlaygroundFile = require("../models/PlaygroundFile");
const PlaygroundRun = require("../models/PlaygroundRun");
const PlaygroundWorkspace = require("../models/PlaygroundWorkspace");
const {
  isDriveConfigured,
  ensureDriveFolder,
  uploadDriveFile,
  updateDriveFileContent,
  readDriveFileAsString,
  deleteDriveFile,
} = require("../../../services/googleDriveService");

const DEFAULT_MAIN_FILES = {
  javascript: "main.js",
  typescript: "main.ts",
  python: "main.py",
  html: "index.html",
  css: "styles.css",
  sql: "query.sql",
  json: "data.json",
  xml: "document.xml",
  markdown: "README.md",
  php: "main.php",
  c: "main.c",
  cpp: "main.cpp",
  java: "Main.java",
  go: "main.go",
  rust: "main.rs",
  ruby: "main.rb",
  bash: "script.sh",
  kotlin: "Main.kt",
  swift: "main.swift",
  csharp: "Program.cs",
  r: "main.R",
  lua: "main.lua",
  powershell: "script.ps1",
  batch: "script.bat",
  dart: "main.dart",
  perl: "main.pl",
  scala: "Main.scala",
  brainfuck: "main.bf",
  regex: "pattern.txt",
};

const DEFAULT_STARTERS = {
  javascript: "// Start coding here\nconsole.log('Hello, PolyCode!');\n",
  python: "# Start coding here\nprint('Hello, PolyCode!')\n",
  php: "<?php\n// Start coding here\necho 'Hello, PolyCode!';\n",
};

function getPlaygroundRootFolderId() {
  return (
    process.env.GOOGLE_DRIVE_PLAYGROUND_FOLDER_ID?.trim() ||
    process.env.GOOGLE_DRIVE_FOLDER_ID?.trim() ||
    ""
  );
}

function assertDriveReady() {
  if (!isDriveConfigured()) {
    const err = new Error(
      "Google Drive is not configured for playground file storage.",
    );
    err.statusCode = 503;
    throw err;
  }
  if (!getPlaygroundRootFolderId()) {
    const err = new Error("GOOGLE_DRIVE_FOLDER_ID is required.");
    err.statusCode = 503;
    throw err;
  }
}

function defaultMainFileName(language) {
  return DEFAULT_MAIN_FILES[language] || "main.txt";
}

function defaultStarterContent(language) {
  return DEFAULT_STARTERS[language] || "// Start coding here\n";
}

async function getLanguageFolderId(userId, language) {
  assertDriveReady();

  const existing = await PlaygroundWorkspace.findOne({ userId, language }).lean();
  if (existing?.driveFolderId) return existing.driveFolderId;

  const rootId = getPlaygroundRootFolderId();
  const userFolderId = await ensureDriveFolder({
    name: `playground_user_${userId}`,
    parentId: rootId,
  });
  const languageFolderId = await ensureDriveFolder({
    name: language,
    parentId: userFolderId,
  });

  await PlaygroundWorkspace.findOneAndUpdate(
    { userId, language },
    { $set: { driveFolderId: languageFolderId } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return languageFolderId;
}

async function serializeFileRecord(record, includeContent = true) {
  const base = {
    id: String(record._id),
    name: record.name,
    language: record.language,
    driveFileId: record.driveFileId,
    sortOrder: record.sortOrder,
    updatedAt: record.updatedAt,
  };

  if (!includeContent) return base;

  try {
    const content = await readDriveFileAsString(record.driveFileId);
    return { ...base, content };
  } catch {
    return { ...base, content: "" };
  }
}

async function ensureDefaultFile(userId, language) {
  const folderId = await getLanguageFolderId(userId, language);
  const name = defaultMainFileName(language);
  const content = defaultStarterContent(language);

  let record = await PlaygroundFile.findOne({ userId, language, name });
  if (record) {
    return serializeFileRecord(record);
  }

  const uploaded = await uploadDriveFile({
    buffer: Buffer.from(content, "utf8"),
    mimeType: "text/plain",
    fileName: name,
    folderId,
  });

  record = await PlaygroundFile.create({
    userId,
    language,
    name,
    driveFileId: uploaded.fileId,
    sortOrder: 0,
  });

  return { ...(await serializeFileRecord(record)), content };
}

async function listFiles(userId, language) {
  const rows = await PlaygroundFile.find({ userId, language })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  if (!rows.length) {
    return [await ensureDefaultFile(userId, language)];
  }

  return Promise.all(rows.map((row) => serializeFileRecord(row)));
}

async function createFile(userId, { language, name, content = "" }) {
  const trimmedName = String(name || "").trim();
  if (!trimmedName) {
    const err = new Error("File name is required.");
    err.statusCode = 400;
    throw err;
  }

  const exists = await PlaygroundFile.findOne({ userId, language, name: trimmedName });
  if (exists) {
    const err = new Error("A file with that name already exists.");
    err.statusCode = 409;
    throw err;
  }

  const folderId = await getLanguageFolderId(userId, language);
  const uploaded = await uploadDriveFile({
    buffer: Buffer.from(String(content), "utf8"),
    mimeType: "text/plain",
    fileName: trimmedName,
    folderId,
  });

  const count = await PlaygroundFile.countDocuments({ userId, language });
  const record = await PlaygroundFile.create({
    userId,
    language,
    name: trimmedName,
    driveFileId: uploaded.fileId,
    sortOrder: count,
  });

  return {
    id: String(record._id),
    name: record.name,
    language: record.language,
    driveFileId: record.driveFileId,
    sortOrder: record.sortOrder,
    updatedAt: record.updatedAt,
    content: String(content),
  };
}

async function updateFile(userId, fileId, { name, content }) {
  const record = await PlaygroundFile.findOne({ _id: fileId, userId });
  if (!record) {
    const err = new Error("File not found.");
    err.statusCode = 404;
    throw err;
  }

  if (typeof content === "string") {
    await updateDriveFileContent({
      fileId: record.driveFileId,
      buffer: Buffer.from(content, "utf8"),
    });
  }

  if (name && name.trim() && name.trim() !== record.name) {
    const trimmedName = name.trim();
    const conflict = await PlaygroundFile.findOne({
      userId,
      language: record.language,
      name: trimmedName,
      _id: { $ne: record._id },
    });
    if (conflict) {
      const err = new Error("A file with that name already exists.");
      err.statusCode = 409;
      throw err;
    }
    record.name = trimmedName;
  }

  await record.save();
  return serializeFileRecord(record);
}

async function removeFile(userId, fileId) {
  const record = await PlaygroundFile.findOne({ _id: fileId, userId });
  if (!record) {
    const err = new Error("File not found.");
    err.statusCode = 404;
    throw err;
  }

  const remaining = await PlaygroundFile.countDocuments({
    userId,
    language: record.language,
  });
  if (remaining <= 1) {
    const err = new Error("Cannot delete the last file in a workspace.");
    err.statusCode = 400;
    throw err;
  }

  await deleteDriveFile(record.driveFileId);
  await PlaygroundFile.deleteOne({ _id: record._id });
  return { success: true };
}

async function saveRun(userId, payload) {
  const {
    language,
    fileId = null,
    fileName = "",
    output = [],
    previewHTML = null,
    durationMs = 0,
  } = payload;

  const run = await PlaygroundRun.create({
    userId,
    language,
    fileId: fileId || null,
    fileName: String(fileName).slice(0, 120),
    output: Array.isArray(output)
      ? output.slice(0, 200).map((line) => ({
          type: line?.type || "stdout",
          text: String(line?.text || "").slice(0, 8000),
        }))
      : [],
    previewHTML: previewHTML ? String(previewHTML).slice(0, 20000) : null,
    durationMs: Number(durationMs) || 0,
  });

  return {
    id: String(run._id),
    createdAt: run.createdAt,
  };
}

async function listRuns(userId, { language, fileId, limit = 10 }) {
  const query = { userId };
  if (language) query.language = language;
  if (fileId) query.fileId = fileId;

  const rows = await PlaygroundRun.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 10, 30))
    .lean();

  return rows.map((row) => ({
    id: String(row._id),
    language: row.language,
    fileId: row.fileId ? String(row.fileId) : null,
    fileName: row.fileName,
    output: row.output,
    previewHTML: row.previewHTML,
    durationMs: row.durationMs,
    createdAt: row.createdAt,
  }));
}

module.exports = {
  listFiles,
  createFile,
  updateFile,
  removeFile,
  saveRun,
  listRuns,
  defaultMainFileName,
  defaultStarterContent,
};
