const heritageItemModel = require("../models/heritageItemModel");
const notificationModel = require("../models/notificationModel");

exports.createItem = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No media uploaded" });

  const itemData = {
    title: req.body.title,
    description: req.body.description,
    media_path: req.file.path.replace(/\\/g, "/"),
    user_id: req.body.user_id,
    category: req.body.category || 'General'
  };

  heritageItemModel.createItem(itemData, (err, itemId) => {
    if (err) return res.status(500).json({ message: "Failed to create item" });
    res.status(201).json({ message: "Item uploaded successfully", id: itemId });
  });
};

exports.updateItem = (req, res) => {
  const id = req.params.id;
  const { title, description, category } = req.body;
  heritageItemModel.update(id, { title, description, category }, (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.json({ message: "Item updated successfully" });
  });
};

exports.getPendingItems = (req, res) => {
  heritageItemModel.getPendingItems((err, items) => {
    if (err) return res.status(500).json({ message: "Failed to fetch pending items" });
    res.json(items);
  });
};

exports.getHistoryItems = (req, res) => {
  const status = req.query.status;
  heritageItemModel.getByStatus(status, (err, items) => {
    if (err) return res.status(500).json({ message: "Fetch failed" });
    res.json(items);
  });
};

exports.approveItem = (req, res) => {
  const id = req.params.id;
  heritageItemModel.approve(id, (err) => {
    if (err) return res.status(404).json({ message: err.message });
    res.json({ message: "Item approved" });
  });
};

exports.denyItem = (req, res) => {
  const id = req.params.id;
  const { rejection_reason } = req.body;
  const trimmedReason = (rejection_reason && rejection_reason.trim()) ? rejection_reason.trim() : "No reason provided";

  console.log(`DENYING ITEM ${id} with reason: ${trimmedReason}`);

  heritageItemModel.deny(id, trimmedReason, (err) => {
    if (err) {
      console.error("DENY ERROR:", err);
      return res.status(404).json({ message: err.message });
    }
    res.json({ message: "Item denied" });
  });
};

exports.getApprovedItems = (req, res) => {
  heritageItemModel.getApproved((err, items) => {
    if (err) return res.status(500).json({ message: "Failed to fetch items" });
    res.json(items);
  });
};

exports.getUserItems = (req, res) => {
  const userId = req.params.userId;
  heritageItemModel.getByUserId(userId, (err, items) => {
    if (err) return res.status(500).json({ message: "Failed to fetch user items" });
    res.json(items);
  });
};

exports.searchItems = (req, res) => {
  heritageItemModel.searchByTitle(req.query.q, (err, items) => {
    if (err) return res.status(500).json({ message: "Search failed" });
    res.json(items);
  });
};
