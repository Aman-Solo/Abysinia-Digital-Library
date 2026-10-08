const MiniRouter = require("../utils/miniRouter");
const router = new MiniRouter();
const bookmarkController = require("../controllers/bookmarkController");

router.post("/add", bookmarkController.addBookmark);
router.post("/remove", bookmarkController.removeBookmark);
router.get("/:userId", bookmarkController.getUserBookmarks);

module.exports = router;
