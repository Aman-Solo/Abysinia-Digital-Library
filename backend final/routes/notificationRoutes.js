const MiniRouter = require("../utils/miniRouter");
const router = new MiniRouter();
const notificationController = require("../controllers/notificationController");

router.get("/notifications", notificationController.getNotifications);

module.exports = router;
