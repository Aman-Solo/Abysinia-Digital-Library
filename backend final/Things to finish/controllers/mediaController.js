const { convertToWebp } = require("../utils/optimizeImage");
const { convertToWebm } = require("../utils/optimizeMedia");

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    let optimized = null;

    if (file.mimetype === "image/jpeg") {
      optimized = await convertToWebp(file.path, file.filename);
    }

    if (file.mimetype === "video/mp4") {
      optimized = await convertToWebm(file.path, file.filename);
    }

    res.json({
      message: "Upload successful",
      original: file.path,
      optimized
    });

  } catch (err) {
    res.status(500).json({ message: "Media processing failed" });
  }
};

module.exports = { uploadMedia };
