const express = require("express");
const requireAuth = require("../../middleware/requireAuth");
const { requireMongoConnection } = require("../../config/database");
const {
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
} = require("./controllers/playgroundController");

const router = express.Router();

router.post("/", executeCodeHandler);

router.use(requireMongoConnection);

router.get("/files", requireAuth, listFilesHandler);
router.get("/recent/files", requireAuth, listRecentFilesHandler);
router.post("/files", requireAuth, createFileHandler);
router.put("/files/:fileId", requireAuth, updateFileHandler);
router.delete("/files/:fileId", requireAuth, deleteFileHandler);

router.put("/workspace", requireAuth, saveWorkspaceHandler);
router.post("/workspace/import", requireAuth, importWorkspaceHandler);

router.post("/runs", requireAuth, saveRunHandler);
router.get("/runs", requireAuth, listRunsHandler);
router.delete("/runs/:runId", requireAuth, deleteRunHandler);
router.delete("/runs", requireAuth, clearRunsHandler);

module.exports = router;
