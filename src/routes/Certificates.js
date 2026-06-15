// routes/Certificates.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

let multer;
try {
  multer = require("multer");
} catch (error) {
  module.exports = router;
  return;
}

const uploadDir = path.join(__dirname, "../../uploads/certificates");
const useMemoryStorage = Boolean(process.env.VERCEL);

const storage = useMemoryStorage
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => {
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => cb(null, file.originalname),
    });

const upload = multer({ storage });

router.post("/upload", upload.single("certificate"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No certificate file uploaded." });
  }

  if (useMemoryStorage) {
    return res.status(501).json({
      error:
        "Certificate file storage is not available on serverless yet. Use Google Drive or object storage.",
    });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/certificates/${req.file.filename}`;
  return res.json({ url: fileUrl });
});

module.exports = router;
