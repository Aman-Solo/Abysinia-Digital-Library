const db = require("../database/db");

exports.createNotification = (message, callback) => {
  const sql = `
    INSERT INTO notifications (message)
    VALUES (?)
  `;
  db.run(sql, [message], function (err) {
    callback(err);
  });
};

exports.getAllNotifications = (callback) => {
  const sql = `
    SELECT * FROM notifications
    ORDER BY created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    callback(err, rows);
  });
};
