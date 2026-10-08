const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { uploadFile } = require("../middleware/upload");

router.put("/update", userController.updateProfile);
router.get("/all", userController.getAllUsers);
router.put("/role", userController.updateUserRole);
router.delete("/:id", userController.deleteUser);
router.get("/stats", userController.getStats);
router.get("/applications", userController.getApplications);
router.put("/applications/:id/approve", userController.approveApplication);
router.put("/applications/:id/reject", userController.rejectApplication);
router.post("/apply", uploadFile.single("id_picture"), userController.submitApplication);

module.exports = router;

