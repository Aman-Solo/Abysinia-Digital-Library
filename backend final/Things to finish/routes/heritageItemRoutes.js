const express = require("express");
const router = express.Router();
const { uploadFile } = require("../middleware/upload");
const heritageItemController = require("../controllers/heritageItemController");
const { requireRole } = require("../middleware/authorize");

router.post(
  "/",
  uploadFile.single("media"),
  heritageItemController.createItem
);

// Public routes
// Public routes
router.get("/", heritageItemController.getApprovedItems);
router.get("/search", heritageItemController.searchItems);
router.get("/user/:userId", heritageItemController.getUserItems);

// Admin/Researcher routes
router.get("/pending", heritageItemController.getPendingItems);
router.get("/history", heritageItemController.getHistoryItems);

router.put("/:id/approve", heritageItemController.approveItem);
router.put("/:id/deny", heritageItemController.denyItem);
router.put("/:id", heritageItemController.updateItem); // General update

module.exports = router;
