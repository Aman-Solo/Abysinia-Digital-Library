const db = require("../database/db");

exports.addBookmark = (userId, itemId, callback) => {
  const sql = "INSERT INTO bookmarks (user_id, item_id) VALUES (?, ?)";
  db.run(sql, [userId, itemId], callback);
};

exports.getBookmarksByUser = (userId, callback) => {
  const sql = `
    SELECT heritage_items.*
    FROM bookmarks
    JOIN heritage_items ON bookmarks.item_id = heritage_items.id
    WHERE bookmarks.user_id = ?
  `;
  db.all(sql, [userId], callback);
};

exports.removeBookmark = (userId, itemId, callback) => {
  const sql = "DELETE FROM bookmarks WHERE user_id = ? AND item_id = ?";
  db.run(sql, [userId, itemId], callback);
};
