const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/submit", contactController.submitMessage);
router.get("/all", contactController.getMessages);
router.delete("/:id", contactController.removeMessage);

module.exports = router;
