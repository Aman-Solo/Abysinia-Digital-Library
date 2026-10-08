const MiniRouter = require("../utils/miniRouter");
const router = new MiniRouter();
const { uploadFile } = require("../middleware/upload");
const learningMaterialController = require("../controllers/learningMaterialController");
const { requireRole } = require("../middleware/authorize");

router.post(
  "/",
  uploadFile.single("media"),
  learningMaterialController.createMaterial
);

// Public routes
router.get("/", learningMaterialController.getApprovedMaterials);
router.get("/search", learningMaterialController.searchMaterials);
router.get("/user/:userId", learningMaterialController.getUserMaterials);

// Admin/Researcher routes
router.get("/pending", learningMaterialController.getPendingMaterials);
router.get("/history", learningMaterialController.getHistoryMaterials);

router.put("/:id/approve", learningMaterialController.approveMaterial);
router.put("/:id/deny", learningMaterialController.denyMaterial);
router.put("/:id", learningMaterialController.updateMaterial); // General update
router.delete("/:id", learningMaterialController.deleteMaterial);

module.exports = router;
