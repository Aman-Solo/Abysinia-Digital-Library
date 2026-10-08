const MiniRouter = require("../utils/miniRouter");
const { uploadFile } = require("../middleware/upload");
const { uploadMedia } = require("../controllers/mediaController");

const router = new MiniRouter();

router.post("/upload", uploadFile.single("media"), uploadMedia);

module.exports = router;
