const PlaygroundFile = require("../models/PlaygroundFile");
const PlaygroundRun = require("../models/PlaygroundRun");
const PlaygroundWorkspace = require("../models/PlaygroundWorkspace");

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
  typescript: "// Start coding here\nconsole.log('Hello, PolyCode!');\n",
  python: "# Start coding here\nprint('Hello, PolyCode!')\n",
  html: "<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, PolyCode!</h1>\n  </body>\n</html>\n",
  css: "body {\n  font-family: system-ui, sans-serif;\n}\n",
  sql: "SELECT 'Hello, PolyCode!' AS message;\n",
  php: "<?php\n// Start coding here\necho 'Hello, PolyCode!';\n",
};

function defaultMainFileName(language) {
  return DEFAULT_MAIN_FILES[language] || "main.txt";
}

function defaultStarterContent(language) {
  return DEFAULT_STARTERS[language] || "// Start coding here\n";
}

function serializeFile(record) {
  return {
    id: String(record._id),
    name: record.name,
    language: record.language,
    content: record.content ?? "",
    sortOrder: record.sortOrder ?? 0,
    updatedAt: record.updatedAt,
  };
}

function serializeWorkspace(record) {
  if (!record) {
    return {
      folders: [],
      activeFileId: null,
      selectedFolder: "",
      expandedFolders: { "": true },
    };
  }

  return {
    folders: Array.isArray(record.folders) ? record.folders : [],
    activeFileId: record.activeFileId ? String(record.activeFileId) : null,
    selectedFolder: record.selectedFolder || "",
    expandedFolders: record.expandedFolders || { "": true },
  };
}

async function getOrCreateWorkspace(userId, language) {
  let workspace = await PlaygroundWorkspace.findOne({ userId, language });
  if (!workspace) {
    workspace = await PlaygroundWorkspace.create({
      userId,
      language,
      folders: [],
      expandedFolders: { "": true },
    });
  }
  return workspace;
}

async function ensureDefaultFile(userId, language) {
  const name = defaultMainFileName(language);
  const content = defaultStarterContent(language);

  let record = await PlaygroundFile.findOne({ userId, language, name });
  if (record) {
    return serializeFile(record);
  }

  record = await PlaygroundFile.create({
    userId,
    language,
    name,
    content,
    sortOrder: 0,
  });

  const workspace = await getOrCreateWorkspace(userId, language);
  if (!workspace.activeFileId) {
    workspace.activeFileId = record._id;
    await workspace.save();
  }

  return serializeFile(record);
}

async function listFiles(userId, language) {
  const workspace = await getOrCreateWorkspace(userId, language);
  const rows = await PlaygroundFile.find({ userId, language })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  const files =
    rows.length > 0
      ? rows.map(serializeFile)
      : [await ensureDefaultFile(userId, language)];

  return {
    files,
    workspace: serializeWorkspace(workspace),
  };
}

async function saveWorkspace(userId, language, patch = {}) {
  const workspace = await getOrCreateWorkspace(userId, language);

  if (Array.isArray(patch.folders)) {
    workspace.folders = patch.folders
      .map((folder) => String(folder || "").trim())
      .filter(Boolean)
      .slice(0, 50);
  }
  if (typeof patch.selectedFolder === "string") {
    workspace.selectedFolder = patch.selectedFolder.slice(0, 160);
  }
  if (patch.expandedFolders && typeof patch.expandedFolders === "object") {
    workspace.expandedFolders = patch.expandedFolders;
  }
  if (patch.activeFileId) {
    const exists = await PlaygroundFile.findOne({
      _id: patch.activeFileId,
      userId,
      language,
    });
    if (exists) {
      workspace.activeFileId = exists._id;
    }
  }

  await workspace.save();
  return serializeWorkspace(workspace);
}

async function createFile(userId, { language, name, content = "" }) {
  const trimmedName = String(name || "").trim();
  if (!trimmedName) {
    const err = new Error("File name is required.");
    err.statusCode = 400;
    throw err;
  }

  const exists = await PlaygroundFile.findOne({
    userId,
    language,
    name: trimmedName,
  });
  if (exists) {
    const err = new Error("A file with that name already exists.");
    err.statusCode = 409;
    throw err;
  }

  const count = await PlaygroundFile.countDocuments({ userId, language });
  const record = await PlaygroundFile.create({
    userId,
    language,
    name: trimmedName,
    content: String(content),
    sortOrder: count,
  });

  await getOrCreateWorkspace(userId, language);

  return serializeFile(record);
}

async function updateFile(userId, fileId, { name, content }) {
  const record = await PlaygroundFile.findOne({ _id: fileId, userId });
  if (!record) {
    const err = new Error("File not found.");
    err.statusCode = 404;
    throw err;
  }

  if (typeof content === "string") {
    record.content = content;
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
  return serializeFile(record);
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

  await PlaygroundFile.deleteOne({ _id: record._id });

  const workspace = await PlaygroundWorkspace.findOne({
    userId,
    language: record.language,
  });
  if (workspace?.activeFileId?.equals(record._id)) {
    const fallback = await PlaygroundFile.findOne({
      userId,
      language: record.language,
    }).sort({ sortOrder: 1, createdAt: 1 });
    workspace.activeFileId = fallback?._id || null;
    await workspace.save();
  }

  return { success: true };
}

async function listRecentFiles(userId, { limit = 40 } = {}) {
  const cap = Math.min(Math.max(Number(limit) || 40, 1), 80);
  const rows = await PlaygroundFile.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(cap)
    .lean();

  return rows.map((row) => ({
    id: String(row._id),
    language: row.language,
    name: row.name,
    contentPreview: String(row.content || "").slice(0, 120),
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  }));
}

async function saveRun(userId, payload) {
  const {
    language,
    fileId = null,
    fileName = "",
    code = "",
    output = [],
    previewHTML = null,
    durationMs = 0,
  } = payload;

  const run = await PlaygroundRun.create({
    userId,
    language,
    fileId: fileId || null,
    fileName: String(fileName).slice(0, 120),
    code: String(code).slice(0, 512000),
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
    .limit(Math.min(Number(limit) || 10, 50))
    .lean();

  return rows.map((row) => ({
    id: String(row._id),
    language: row.language,
    fileId: row.fileId ? String(row.fileId) : null,
    fileName: row.fileName,
    code: row.code || "",
    output: row.output,
    previewHTML: row.previewHTML,
    durationMs: row.durationMs,
    createdAt: row.createdAt,
  }));
}

async function removeRun(userId, runId) {
  const result = await PlaygroundRun.deleteOne({ _id: runId, userId });
  if (result.deletedCount === 0) {
    const error = new Error("Run not found.");
    error.statusCode = 404;
    throw error;
  }
  return { success: true };
}

async function clearRuns(userId, { language, fileId } = {}) {
  const query = { userId };
  if (language) query.language = language;
  if (fileId) query.fileId = fileId;
  const result = await PlaygroundRun.deleteMany(query);
  return { success: true, deleted: result.deletedCount };
}

/** Push a full local workspace to the cloud (first login / migration). */
async function importWorkspace(userId, language, { files = [], workspace = {} }) {
  if (!Array.isArray(files) || files.length === 0) {
    return listFiles(userId, language);
  }

  const existingCount = await PlaygroundFile.countDocuments({ userId, language });
  if (existingCount > 1) {
    return listFiles(userId, language);
  }

  await PlaygroundFile.deleteMany({ userId, language });

  const created = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const name = String(file.name || defaultMainFileName(language)).trim();
    if (!name) continue;

    const record = await PlaygroundFile.create({
      userId,
      language,
      name,
      content: String(file.content ?? defaultStarterContent(language)),
      sortOrder: index,
    });
    created.push(record);
  }

  if (!created.length) {
    return listFiles(userId, language);
  }

  const activeLocalId = workspace.activeFileId;
  const activeIndex = files.findIndex((file) => file.id === activeLocalId);
  const activeRecord = created[activeIndex >= 0 ? activeIndex : 0];

  await PlaygroundWorkspace.findOneAndUpdate(
    { userId, language },
    {
      $set: {
        folders: Array.isArray(workspace.folders) ? workspace.folders : [],
        selectedFolder: workspace.selectedFolder || "",
        expandedFolders: workspace.expandedFolders || { "": true },
        activeFileId: activeRecord._id,
      },
    },
    { upsert: true, new: true },
  );

  return listFiles(userId, language);
}

module.exports = {
  listFiles,
  listRecentFiles,
  saveWorkspace,
  importWorkspace,
  createFile,
  updateFile,
  removeFile,
  saveRun,
  listRuns,
  removeRun,
  clearRuns,
  defaultMainFileName,
  defaultStarterContent,
};
