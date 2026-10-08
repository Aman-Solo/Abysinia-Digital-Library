const db = require("../database/db");

const quizModel = {
    createQuiz: (quizData, callback) => {
        const { teacher_id, title, description } = quizData;
        db.run(
            "INSERT INTO quizzes (teacher_id, title, description) VALUES (?, ?, ?)",
            [teacher_id, title, description],
            function (err) {
                callback(err, this.lastID);
            }
        );
    },

    addQuestion: (questionData, callback) => {
        const { quiz_id, type, question_text, options, correct_answer } = questionData;
        db.run(
            "INSERT INTO questions (quiz_id, type, question_text, options, correct_answer) VALUES (?, ?, ?, ?, ?)",
            [quiz_id, type, question_text, options, correct_answer],
            callback
        );
    },

    getPendingQuizzes: (callback) => {
        db.all(
            "SELECT q.*, u.username as teacher_name FROM quizzes q JOIN users u ON q.teacher_id = u.id WHERE q.status = 'pending'",
            callback
        );
    },

    getApprovedQuizzes: (callback) => {
        db.all(
            "SELECT q.*, u.username as teacher_name FROM quizzes q JOIN users u ON q.teacher_id = u.id WHERE q.status = 'approved'",
            callback
        );
    },

    getQuizWithQuestions: (quizId, callback) => {
        db.get("SELECT * FROM quizzes WHERE id = ?", [quizId], (err, quiz) => {
            if (err || !quiz) return callback(err || new Error("Quiz not found"));
            db.all("SELECT * FROM questions WHERE quiz_id = ?", [quizId], (err, questions) => {
                callback(err, { ...quiz, questions });
            });
        });
    },

    approveQuiz: (quizId, callback) => {
        db.run("UPDATE quizzes SET status = 'approved' WHERE id = ?", [quizId], callback);
    },

    denyQuiz: (quizId, callback) => {
        db.run("UPDATE quizzes SET status = 'denied' WHERE id = ?", [quizId], callback);
    },

    submitQuiz: (submissionData, callback) => {
        const { student_id, quiz_id, answers, score } = submissionData;
        db.run(
            "INSERT INTO quiz_submissions (student_id, quiz_id, answers, score) VALUES (?, ?, ?, ?)",
            [student_id, quiz_id, answers, score],
            callback
        );
    },

    getTeacherQuizzes: (teacherId, callback) => {
        db.all("SELECT * FROM quizzes WHERE teacher_id = ?", [teacherId], callback);
    },

    getStudentSubmissions: (studentId, callback) => {
        db.all(
            "SELECT s.*, q.title as quiz_title, u.username as teacher_name FROM quiz_submissions s JOIN quizzes q ON s.quiz_id = q.id JOIN users u ON q.teacher_id = u.id WHERE s.student_id = ?",
            [studentId],
            callback
        );
    }
};

module.exports = quizModel;
