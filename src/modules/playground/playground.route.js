const express = require("express");
const requireAuth = require("../../middleware/requireAuth");
const { requireMongoConnection } = require("../../config/database");
const {
  executeCodeHandler,
  listFilesHandler,
  createFileHandler,
  updateFileHandler,
  deleteFileHandler,
  saveRunHandler,
  listRunsHandler,
} = require("./controllers/playgroundController");

const router = express.Router();

router.post("/", executeCodeHandler);

router.use(requireMongoConnection);

router.get("/files", requireAuth, listFilesHandler);
router.post("/files", requireAuth, createFileHandler);
router.put("/files/:fileId", requireAuth, updateFileHandler);
router.delete("/files/:fileId", requireAuth, deleteFileHandler);

router.post("/runs", requireAuth, saveRunHandler);
router.get("/runs", requireAuth, listRunsHandler);

module.exports = router;
