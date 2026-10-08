const MiniRouter = require("../utils/miniRouter");
const router = new MiniRouter();
const quizController = require("../controllers/quizController");

router.post("/", quizController.createQuiz);
router.get("/pending", quizController.getPendingQuizzes);
router.get("/approved", quizController.getApprovedQuizzes);
router.get("/history", quizController.getHistoryQuizzes);
router.get("/:id", quizController.getQuizDetails);
router.put("/:id/approve", quizController.approveQuiz);
router.put("/:id/deny", quizController.denyQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.post("/submit", quizController.submitQuiz);
router.get("/teacher/:teacherId", quizController.getTeacherQuizzes);
router.get("/student/:studentId", quizController.getStudentSubmissions);

module.exports = router;
