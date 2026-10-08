const MiniRouter = require("../utils/miniRouter");
const router = new MiniRouter();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/get-questions", authController.getSecurityQuestions);
router.post("/forgot-password", authController.forgotPassword);

module.exports = router;

