// database/db.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/chpa.db");

db.serialize(() => {
    // Users table
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT, 
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        bio TEXT,
        age INTEGER,
        security_question_1 TEXT,
        security_answer_1 TEXT,
        security_question_2 TEXT,
        security_answer_2 TEXT,
        security_question_3 TEXT,
        security_answer_3 TEXT,
        application_status TEXT DEFAULT 'none',
        full_name_app TEXT,
        credentials TEXT,
        graduation_info TEXT,
        id_picture TEXT
    )`, (err) => {
        if (err) console.error("Error creating users table:", err);
        else {
            console.log("Users table initialized.");
            // Ensure bio and age columns exist
            db.all("PRAGMA table_info(users)", (err, rows) => {
                if (rows) {
                    const columns = rows.map(r => r.name);
                    if (!columns.includes("bio")) db.run("ALTER TABLE users ADD COLUMN bio TEXT");
                    if (!columns.includes("age")) db.run("ALTER TABLE users ADD COLUMN age INTEGER");
                }
            });
        }
    });

    // Heritage Items table
    db.run(`CREATE TABLE IF NOT EXISTS heritage_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        file_path TEXT, 
        category TEXT,
        rejection_reason TEXT,
        user_id INTEGER,
        status TEXT DEFAULT 'pending',
        file_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Bookmarks table
    db.run(`CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        item_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(item_id) REFERENCES heritage_items(id)
    )`);

    // Notifications table
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        message TEXT,
        read INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Quizzes table
    db.run(`CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER,
        title TEXT,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(teacher_id) REFERENCES users(id)
    )`);

    // Questions table
    db.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER,
        type TEXT, -- 'multiple_choice' or 'fill_in'
        question_text TEXT,
        options TEXT, -- JSON string for multiple choice
        correct_answer TEXT,
        FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    )`);

    // Quiz Submissions table
    db.run(`CREATE TABLE IF NOT EXISTS quiz_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        quiz_id INTEGER,
        answers TEXT, -- JSON string
        score INTEGER,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
    )`);

    // Contact Messages table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        status TEXT DEFAULT 'unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
