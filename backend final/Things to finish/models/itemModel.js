// models/itemModel.js
exports.createItem = (item, cb) => {
  db.run(
    "INSERT INTO heritage_items (title, description, language, status) VALUES (?, ?, ?, ?)",
    [item.title, item.description, item.language, "pending"],
    cb
  );
};
