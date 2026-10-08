const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");

router.post("/add", bookmarkController.addBookmark);
router.post("/remove", bookmarkController.removeBookmark);
router.get("/:userId", bookmarkController.getUserBookmarks);

module.exports = router;
