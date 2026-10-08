const db = require("../database/db");

exports.addBookmark = (req, res) => {
  const { user_id, item_id } = req.body;

  if (!user_id || !item_id) {
    return res.status(400).json({ message: "User ID and Item ID required" });
  }

  const sql = "INSERT INTO bookmarks (user_id, item_id) VALUES (?, ?)";
  db.run(sql, [user_id, item_id], function (err) {
    if (err) {
      // Unique constraint might trigger if already bookmarked, handle gracefully
      if (err.message.includes("UNIQUE")) {
        return res.json({ message: "Already bookmarked" });
      }
      return res.status(500).json({ message: "Failed to bookmark" });
    }
    res.status(201).json({ message: "Bookmarked successfully" });
  });
};

exports.removeBookmark = (req, res) => {
  const { user_id, item_id } = req.body;

  const sql = "DELETE FROM bookmarks WHERE user_id = ? AND item_id = ?";
  db.run(sql, [user_id, item_id], function (err) {
    if (err) return res.status(500).json({ message: "Failed to remove bookmark" });
    res.json({ message: "Bookmark removed" });
  });
};

exports.getUserBookmarks = (req, res) => {
  const userId = req.params.userId;
  // Join with heritage_items to get item details
  const sql = `
        SELECT b.id as bookmark_id, h.* 
        FROM bookmarks b
        JOIN heritage_items h ON b.item_id = h.id
        WHERE b.user_id = ?
    `;
  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to fetch bookmarks" });
    res.json(rows);
  });
};
