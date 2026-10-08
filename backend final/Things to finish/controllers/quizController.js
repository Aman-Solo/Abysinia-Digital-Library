const quizModel = require("../models/quizModel");

exports.createQuiz = (req, res) => {
    const { teacher_id, title, description, questions } = req.body;

    quizModel.createQuiz({ teacher_id, title, description }, (err, quizId) => {
        if (err) return res.status(500).json({ message: "Failed to create quiz" });

        // Add questions
        let processCount = 0;
        if (!questions || questions.length === 0) {
            return res.status(201).json({ message: "Quiz created (no questions)", id: quizId });
        }

        questions.forEach(q => {
            quizModel.addQuestion({
                quiz_id: quizId,
                type: q.type,
                question_text: q.question_text,
                options: JSON.stringify(q.options),
                correct_answer: q.correct_answer
            }, (err) => {
                processCount++;
                if (processCount === questions.length) {
                    res.status(201).json({ message: "Quiz and questions created", id: quizId });
                }
            });
        });
    });
};

exports.getPendingQuizzes = (req, res) => {
    quizModel.getPendingQuizzes((err, quizzes) => {
        if (err) return res.status(500).json({ message: "Failed to fetch quizzes" });
        res.json(quizzes);
    });
};

exports.getApprovedQuizzes = (req, res) => {
    quizModel.getApprovedQuizzes((err, quizzes) => {
        if (err) return res.status(500).json({ message: "Failed to fetch quizzes" });
        res.json(quizzes);
    });
};

exports.getQuizDetails = (req, res) => {
    quizModel.getQuizWithQuestions(req.params.id, (err, quiz) => {
        if (err) return res.status(404).json({ message: err.message });
        res.json(quiz);
    });
};

exports.approveQuiz = (req, res) => {
    quizModel.approveQuiz(req.params.id, (err) => {
        if (err) return res.status(500).json({ message: "Approval failed" });
        res.json({ message: "Quiz approved" });
    });
};

exports.denyQuiz = (req, res) => {
    quizModel.denyQuiz(req.params.id, (err) => {
        if (err) return res.status(500).json({ message: "Denial failed" });
        res.json({ message: "Quiz denied" });
    });
};

exports.submitQuiz = (req, res) => {
    const { student_id, quiz_id, answers, score } = req.body;
    quizModel.submitQuiz({
        student_id,
        quiz_id,
        answers: JSON.stringify(answers),
        score
    }, (err) => {
        if (err) return res.status(500).json({ message: "Submission failed" });
        res.json({ message: "Quiz submitted successfully" });
    });
};

exports.getTeacherQuizzes = (req, res) => {
    quizModel.getTeacherQuizzes(req.params.teacherId, (err, quizzes) => {
        if (err) return res.status(500).json({ message: "Failed to fetch quizzes" });
        res.json(quizzes);
    });
};

exports.getStudentSubmissions = (req, res) => {
    quizModel.getStudentSubmissions(req.params.studentId, (err, subs) => {
        if (err) return res.status(500).json({ message: "Failed to fetch submissions" });
        res.json(subs);
    });
};
