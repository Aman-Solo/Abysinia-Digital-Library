const db = require("../database/db");

// Helper query with user join
const withUser = `
  SELECT m.*, u.username, u.email 
  FROM learning_materials m 
  LEFT JOIN users u ON m.user_id = u.id
`;

exports.createMaterial = (item, callback) => {
    const sql = `
    INSERT INTO learning_materials (
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

exports.getPendingMaterials = (callback) => {
    const sql = `${withUser} WHERE m.status = 'pending' ORDER BY m.created_at DESC`;
    db.all(sql, [], callback);
};

exports.getByStatus = (status, callback) => {
    let sql = withUser;
    let params = [];

    if (status === 'history' || status === 'approved' || status === 'denied') {
        sql += " WHERE m.status != 'pending'";
    } else if (status) {
        sql += " WHERE m.status = ?";
        params.push(status);
    }

    sql += " ORDER BY m.created_at DESC";
    db.all(sql, params, callback);
};

exports.update = (id, data, callback) => {
    const { title, description, category } = data;
    const sql = "UPDATE learning_materials SET title = ?, description = ?, category = ? WHERE id = ?";
    db.run(sql, [title, description, category, id], (err) => callback(err));
};

exports.approve = (id, callback) => {
    const sql = "UPDATE learning_materials SET status = 'approved', rejection_reason = NULL WHERE id = ?";
    db.run(sql, [id], function (err) {
        if (err) return callback(err);
        callback(null);
    });
};

exports.deny = (id, reason, callback) => {
    const sql = "UPDATE learning_materials SET status = 'denied', rejection_reason = ? WHERE id = ?";
    db.run(sql, [reason || "No reason provided", id], function (err) {
        if (err) return callback(err);
        callback(null);
    });
};

exports.getApproved = (callback) => {
    const sql = `${withUser} WHERE m.status = 'approved' ORDER BY m.created_at DESC`;
    db.all(sql, [], callback);
};

exports.getByUserId = (userId, callback) => {
    const sql = `${withUser} WHERE m.user_id = ? ORDER BY m.created_at DESC`;
    db.all(sql, [userId], callback);
};

exports.searchByTitle = (query, callback) => {
    const sql = `${withUser} WHERE m.status = 'approved' AND (m.title LIKE ? OR m.description LIKE ?) ORDER BY m.created_at DESC`;
    const q = `%${query}%`;
    db.all(sql, [q, q], callback);
};

exports.delete = (id, callback) => {
    // Explicitly delete all dependent records
    db.serialize(() => {
        db.run("DELETE FROM bookmarks WHERE item_id = ?", [id]);
        const sql = "DELETE FROM learning_materials WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) {
                console.error(`DELETE MATERIAL ERROR [ID: ${id}]:`, err.message);
                return callback(err);
            }
            console.log(`Successfully deleted Material ID: ${id}. Changes: ${this.changes}`);
            callback(null);
        });
    });
};
