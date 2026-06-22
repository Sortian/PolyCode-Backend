const {
  executeCode,
  validateExecutionRequest,
} = require("../services/playgroundService");
const playgroundStorage = require("../services/playgroundStorageService");

function handleError(res, error, fallbackStatus = 500) {
  const statusCode = error.statusCode || fallbackStatus;
  return res.status(statusCode).json({
    error: error.message || "Request failed.",
    success: false,
  });
}

async function executeCodeHandler(req, res) {
  try {
    const { language, code, stdin = "" } = req.body || {};

    const validation = validateExecutionRequest(language, code);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await executeCode(language, code, stdin);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      stdout: "",
      stderr: err.message,
      error: err.message,
      exitCode: 1,
    });
  }
}

async function listFilesHandler(req, res) {
  try {
    const language = String(req.query.language || "").trim();
    if (!language) {
      return res.status(400).json({ error: "language is required." });
    }

    const payload = await playgroundStorage.listFiles(req.userId, language);
    return res.json({ success: true, ...payload });
  } catch (error) {
    return handleError(res, error);
  }
}

async function listRecentFilesHandler(req, res) {
  try {
    const files = await playgroundStorage.listRecentFiles(req.userId, {
      limit: req.query.limit,
    });
    return res.json({ success: true, files });
  } catch (error) {
    return handleError(res, error);
  }
}

async function saveWorkspaceHandler(req, res) {
  try {
    const { language, folders, activeFileId, selectedFolder, expandedFolders } =
      req.body || {};
    if (!language) {
      return res.status(400).json({ error: "language is required." });
    }

    const workspace = await playgroundStorage.saveWorkspace(req.userId, language, {
      folders,
      activeFileId,
      selectedFolder,
      expandedFolders,
    });
    return res.json({ success: true, workspace });
  } catch (error) {
    return handleError(res, error);
  }
}

async function importWorkspaceHandler(req, res) {
  try {
    const { language, files, workspace } = req.body || {};
    if (!language) {
      return res.status(400).json({ error: "language is required." });
    }

    const payload = await playgroundStorage.importWorkspace(req.userId, language, {
      files,
      workspace,
    });
    return res.json({ success: true, ...payload });
  } catch (error) {
    return handleError(res, error);
  }
}

async function createFileHandler(req, res) {
  try {
    const { language, name, content } = req.body || {};
    if (!language) {
      return res.status(400).json({ error: "language is required." });
    }

    const file = await playgroundStorage.createFile(req.userId, {
      language,
      name,
      content,
    });
    return res.status(201).json({ success: true, file });
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateFileHandler(req, res) {
  try {
    const fileId = String(req.params.fileId || "").trim();
    const { name, content } = req.body || {};
    const file = await playgroundStorage.updateFile(req.userId, fileId, {
      name,
      content,
    });
    return res.json({ success: true, file });
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteFileHandler(req, res) {
  try {
    const fileId = String(req.params.fileId || "").trim();
    const result = await playgroundStorage.removeFile(req.userId, fileId);
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

async function saveRunHandler(req, res) {
  try {
    const {
      language,
      fileId,
      fileName,
      code,
      output,
      previewHTML,
      durationMs,
    } = req.body || {};

    if (!language) {
      return res.status(400).json({ error: "language is required." });
    }

    const run = await playgroundStorage.saveRun(req.userId, {
      language,
      fileId,
      fileName,
      code,
      output,
      previewHTML,
      durationMs,
    });
    return res.status(201).json({ success: true, run });
  } catch (error) {
    return handleError(res, error);
  }
}

async function listRunsHandler(req, res) {
  try {
    const runs = await playgroundStorage.listRuns(req.userId, {
      language: req.query.language,
      fileId: req.query.fileId,
      limit: req.query.limit,
    });
    return res.json({ success: true, runs });
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteRunHandler(req, res) {
  try {
    const runId = String(req.params.runId || "").trim();
    const result = await playgroundStorage.removeRun(req.userId, runId);
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

async function clearRunsHandler(req, res) {
  try {
    const result = await playgroundStorage.clearRuns(req.userId, {
      language: req.query.language,
      fileId: req.query.fileId,
    });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  executeCodeHandler,
  listFilesHandler,
  listRecentFilesHandler,
  saveWorkspaceHandler,
  importWorkspaceHandler,
  createFileHandler,
  updateFileHandler,
  deleteFileHandler,
  saveRunHandler,
  listRunsHandler,
  deleteRunHandler,
  clearRunsHandler,
};
