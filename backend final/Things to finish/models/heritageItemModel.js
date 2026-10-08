const db = require("../database/db");

// Helper query with user join
const withUser = `
  SELECT h.*, u.username, u.email 
  FROM heritage_items h 
  LEFT JOIN users u ON h.user_id = u.id
`;

exports.createItem = (item, callback) => {
  const sql = `
    INSERT INTO heritage_items (
      title,
      description,
      file_path,
      category,
      user_id,
      status,
      file_type,
      rejection_reason
    ) VALUES (?, ?, ?, ?, ?, 'pending', ?, NULL)
  `;

  const fileType = item.media_path.split('.').pop();

  db.run(
    sql,
    [
      item.title,
      item.description,
      item.media_path,
      item.category || "General",
      item.user_id,
      fileType
    ],
    function (err) {
      if (err) return callback(err);
      callback(null, this.lastID);
    }
  );
};

exports.getPendingItems = (callback) => {
  const sql = `${withUser} WHERE h.status = 'pending' ORDER BY h.created_at DESC`;
  db.all(sql, [], callback);
};

exports.getByStatus = (status, callback) => {
  let sql = withUser;
  let params = [];

  if (status === 'history' || status === 'approved' || status === 'denied') {
    sql += " WHERE h.status != 'pending'";
  } else if (status) {
    sql += " WHERE h.status = ?";
    params.push(status);
  }

  sql += " ORDER BY h.created_at DESC";
  db.all(sql, params, callback);
};

exports.update = (id, data, callback) => {
  const { title, description, category } = data;
  const sql = "UPDATE heritage_items SET title = ?, description = ?, category = ? WHERE id = ?";
  db.run(sql, [title, description, category, id], (err) => callback(err));
};

exports.approve = (id, callback) => {
  const sql = "UPDATE heritage_items SET status = 'approved', rejection_reason = NULL WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) return callback(err);
    callback(null);
  });
};

exports.deny = (id, reason, callback) => {
  const sql = "UPDATE heritage_items SET status = 'denied', rejection_reason = ? WHERE id = ?";
  db.run(sql, [reason || "No reason provided", id], function (err) {
    if (err) return callback(err);
    callback(null);
  });
};

exports.getApproved = (callback) => {
  const sql = `${withUser} WHERE h.status = 'approved' ORDER BY h.created_at DESC`;
  db.all(sql, [], callback);
};

exports.getByUserId = (userId, callback) => {
  const sql = `${withUser} WHERE h.user_id = ? ORDER BY h.created_at DESC`;
  db.all(sql, [userId], callback);
};

exports.searchByTitle = (query, callback) => {
  const sql = `${withUser} WHERE h.status = 'approved' AND (h.title LIKE ? OR h.description LIKE ?) ORDER BY h.created_at DESC`;
  const q = `%${query}%`;
  db.all(sql, [q, q], callback);
};

exports.filterByLanguage = (language, callback) => {
  const sql = `${withUser} WHERE h.status = 'approved' AND h.language = ?`;
  db.all(sql, [language], callback);
};
