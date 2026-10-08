const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const HARDCODED_ADMINS = {
  "YohannesGumata@gmail.com": "Johannes",
  "FenetMengistu@gmail.com": "Fenet",
  "FikerYohannes@gmail.com": "Fikir",
  "Ezuman@gmail.com": "Ezana",
  "FiradusKedir@gmail.com": "Firadus",
  "Lidya@gmail.om": "Lidya",
  "AmanuelSolomon@gmail.com": "Amanuel",
  "HawiJarso@gmail.com": "Hawi"
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Check hardcoded system admins
  if (HARDCODED_ADMINS[email] && HARDCODED_ADMINS[email] === password) {
    return res.json({
      message: "Login successful as System Admin",
      user: {
        id: -1, // Use a special ID for hardcoded admins
        username: email.split('@')[0],
        email: email,
        role: "system_admin"
      }
    });
  }

  userModel.findByEmail(email, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if verification is required (contributor only)
    if (user.role === 'contributor' && user.application_status !== 'approved') {
      let statusMsg = "Your application is still under review by the system admins. Please wait.";
      if (user.application_status === 'rejected') statusMsg = "Your application has been rejected.";
      if (user.application_status === 'pending_application' || user.application_status === 'none') statusMsg = "Please complete your teacher verification to proceed.";

      return res.status(403).json({
        message: statusMsg,
        application_status: user.application_status
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
};

exports.register = (req, res) => {
  const { username, email, password, role, security_questions } = req.body; // Expecting array of { question, answer }

  if (!username || !email || !password || !role || !security_questions || security_questions.length !== 3) {
    return res.status(400).json({ message: "All fields and 3 security questions are required" });
  }

  // Check if email belongs to hardcoded admin
  if (HARDCODED_ADMINS[email]) {
    return res.status(403).json({ message: "This email is reserved for system administrators." });
  }

  // Check if user already exists
  userModel.findByEmail(email, (err, existingUser) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (existingUser) return res.status(409).json({ message: "User already registered. Please login." });

    const hashedPassword = bcrypt.hashSync(password, 8);

    // Hash all 3 answers
    const hashedAnswers = security_questions.map(q =>
      bcrypt.hashSync(q.answer.toLowerCase().trim(), 8)
    );

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role,
      security_question_1: security_questions[0].question,
      security_answer_1: hashedAnswers[0],
      security_question_2: security_questions[1].question,
      security_answer_2: hashedAnswers[1],
      security_question_3: security_questions[2].question,
      security_answer_3: hashedAnswers[2],
      application_status: role === 'contributor' ? 'pending_application' : 'none'
    };

    userModel.create(newUser, (err) => {
      if (err) {
        console.error("Registration Error Details:", err);
        return res.status(500).json({ message: "Registration failed: " + (err.message || "Unknown db error") });
      }
      res.status(201).json({
        message: "User registered successfully",
        application_status: newUser.application_status,
        email: newUser.email // Return email so frontend can store it for application
      });
    }
    );
  });
};

// Step 1: Get Questions
exports.getSecurityQuestions = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  userModel.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      questions: [
        user.security_question_1,
        user.security_question_2,
        user.security_question_3
      ]
    });
  });
};

// Step 2: Verify & Reset
exports.forgotPassword = (req, res) => {
  const { email, security_answers, new_password } = req.body; // Expects an array of 3 answers

  if (!email || !security_answers || security_answers.length !== 3 || !new_password) {
    return res.status(400).json({ message: "All fields and 3 answers are required" });
  }

  userModel.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate all 3 answers
    const valid1 = bcrypt.compareSync(security_answers[0].toLowerCase().trim(), user.security_answer_1);
    const valid2 = bcrypt.compareSync(security_answers[1].toLowerCase().trim(), user.security_answer_2);
    const valid3 = bcrypt.compareSync(security_answers[2].toLowerCase().trim(), user.security_answer_3);

    if (!valid1 || !valid2 || !valid3) {
      return res.status(401).json({ message: "One or more security answers are incorrect" });
    }

    const hashedPassword = bcrypt.hashSync(new_password, 8);

    // Direct update for now, ideally should be in userModel
    const db = require("../database/db");
    db.run("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id], (err) => {
      if (err) return res.status(500).json({ message: "Failed to update password" });
      res.json({ message: "Password reset successfully" });
    });
  });
};
