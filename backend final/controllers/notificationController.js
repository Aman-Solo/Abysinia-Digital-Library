const notificationModel = require("../models/notificationModel");

exports.getNotifications = (req, res) => {
  notificationModel.getAllNotifications((err, notifications) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(notifications);
  });
};
