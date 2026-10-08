const db = require("../database/db");

exports.findByEmail = (email, callback) => {
  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    callback
  );
};

exports.findByUsername = (username, callback) => {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    callback
  );
};
exports.create = (user, callback) => {
  db.run(
    `INSERT INTO users (
        username, email, password, role, 
        security_question_1, security_answer_1,
        security_question_2, security_answer_2,
        security_question_3, security_answer_3,
        application_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.username, user.email, user.password, user.role,
      user.security_question_1, user.security_answer_1,
      user.security_question_2, user.security_answer_2,
      user.security_question_3, user.security_answer_3,
      user.application_status || 'none'
    ],
    callback
  );
};

exports.getAll = (callback) => {
  db.all("SELECT id, username, email, role, bio, age, application_status FROM users", [], callback);
};

exports.updateRole = (id, role, callback) => {
  db.run("UPDATE users SET role = ? WHERE id = ?", [role, id], callback);
};

exports.deleteUser = (id, callback) => {
  db.run("DELETE FROM users WHERE id = ?", [id], callback);
};

exports.submitApplication = (id, data, callback) => {
  const { id_picture, full_name_app, credentials, graduation_info } = data;
  db.run(
    `UPDATE users SET 
      id_picture = ?, 
      full_name_app = ?, 
      credentials = ?, 
      graduation_info = ?, 
      application_status = 'pending' 
     WHERE id = ?`,
    [id_picture, full_name_app, credentials, graduation_info, id],
    callback
  );
};

exports.getPendingApplications = (callback) => {
  db.all("SELECT id, username, email, full_name_app, credentials, graduation_info, id_picture FROM users WHERE application_status = 'pending'", [], callback);
};

exports.updateApplicationStatus = (id, status, callback) => {
  db.run("UPDATE users SET application_status = ? WHERE id = ?", [status, id], callback);
};

exports.getStats = (callback) => {
  db.get("SELECT COUNT(*) as totalUsers FROM users", (err, userStats) => {
    if (err) return callback(err);
    db.get("SELECT COUNT(*) as totalItems FROM heritage_items", (err, itemStats) => {
      if (err) return callback(err);
      callback(null, { ...userStats, ...itemStats });
    });
  });
};

