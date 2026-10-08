const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.post("/", quizController.createQuiz);
router.get("/pending", quizController.getPendingQuizzes);
router.get("/approved", quizController.getApprovedQuizzes);
router.get("/:id", quizController.getQuizDetails);
router.put("/:id/approve", quizController.approveQuiz);
router.put("/:id/deny", quizController.denyQuiz);
router.post("/submit", quizController.submitQuiz);
router.get("/teacher/:teacherId", quizController.getTeacherQuizzes);
router.get("/student/:studentId", quizController.getStudentSubmissions);

module.exports = router;
