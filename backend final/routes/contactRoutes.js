const MiniRouter = require("../utils/miniRouter");
const router = new MiniRouter();
const contactController = require("../controllers/contactController");

router.post("/submit", contactController.submitMessage);
router.get("/all", contactController.getMessages);
router.delete("/:id", contactController.removeMessage);

module.exports = router;
