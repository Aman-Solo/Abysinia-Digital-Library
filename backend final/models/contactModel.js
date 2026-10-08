const db = require("../database/db");

exports.createMessage = (data, callback) => {
    const { name, email, subject, message } = data;
    const createTable = `CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        status TEXT DEFAULT 'unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

    db.run(createTable, (createErr) => {
        if (createErr) return callback(createErr);
        const query = `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`;
        db.run(query, [name, email, subject, message], function (err) {
            callback(err, this ? this.lastID : null);
        });
    });
};

exports.getAllMessages = (callback) => {
    const query = `SELECT * FROM contact_messages ORDER BY created_at DESC`;
    db.all(query, [], (err, rows) => {
        callback(err, rows);
    });
};

exports.deleteMessage = (id, callback) => {
    const query = `DELETE FROM contact_messages WHERE id = ?`;
    db.run(query, [id], (err) => {
        callback(err);
    });
};
