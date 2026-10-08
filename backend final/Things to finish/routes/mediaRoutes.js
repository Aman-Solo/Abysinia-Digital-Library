const express = require("express");
const { uploadFile } = require("../middleware/upload");
const { uploadMedia } = require("../controllers/mediaController");

const router = express.Router();

router.post("/upload", uploadFile.single("media"), uploadMedia);

module.exports = router;
