const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/originals");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadFile = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = { uploadFile };
