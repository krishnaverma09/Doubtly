const multer = require("multer");

// Store files in memory (for Cloudinary streaming)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});

module.exports = upload;
