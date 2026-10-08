const learningMaterialModel = require("../models/learningMaterialModel");

exports.createMaterial = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No media uploaded" });

  const itemData = {
    title: req.body.title,
    description: req.body.description,
    media_path: req.file.path.replace(/\\/g, "/"),
    user_id: req.body.user_id,
    category: req.body.category || 'General'
  };

  learningMaterialModel.createMaterial(itemData, (err, itemId) => {
    if (err) return res.status(500).json({ message: "Failed to create material" });
    res.status(201).json({ message: "Material uploaded successfully", id: itemId });
  });
};

exports.updateMaterial = (req, res) => {
  const id = req.params.id;
  const { title, description, category } = req.body;
  learningMaterialModel.update(id, { title, description, category }, (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.json({ message: "Material updated successfully" });
  });
};

exports.getPendingMaterials = (req, res) => {
  learningMaterialModel.getPendingMaterials((err, items) => {
    if (err) return res.status(500).json({ message: "Failed to fetch pending materials" });
    res.json(items);
  });
};

exports.getHistoryMaterials = (req, res) => {
  const status = req.query.status;
  learningMaterialModel.getByStatus(status, (err, items) => {
    if (err) return res.status(500).json({ message: "Fetch failed" });
    res.json(items);
  });
};

exports.approveMaterial = (req, res) => {
  const id = req.params.id;
  learningMaterialModel.approve(id, (err) => {
    if (err) return res.status(404).json({ message: err.message });
    res.json({ message: "Material approved" });
  });
};

exports.denyMaterial = (req, res) => {
  const id = req.params.id;
  const { rejection_reason } = req.body;
  const trimmedReason = (rejection_reason && rejection_reason.trim()) ? rejection_reason.trim() : "No reason provided";

  console.log(`DENYING MATERIAL ${id} with reason: ${trimmedReason}`);

  learningMaterialModel.deny(id, trimmedReason, (err) => {
    if (err) {
      console.error("DENY ERROR:", err);
      return res.status(404).json({ message: err.message });
    }
    res.json({ message: "Material denied" });
  });
};

exports.getApprovedMaterials = (req, res) => {
  learningMaterialModel.getApproved((err, items) => {
    if (err) return res.status(500).json({ message: "Failed to fetch materials" });
    res.json(items);
  });
};

exports.getUserMaterials = (req, res) => {
  const userId = req.params.userId;
  learningMaterialModel.getByUserId(userId, (err, items) => {
    if (err) return res.status(500).json({ message: "Failed to fetch user materials" });
    res.json(items);
  });
};

exports.searchMaterials = (req, res) => {
  learningMaterialModel.searchByTitle(req.query.q, (err, items) => {
    if (err) return res.status(500).json({ message: "Search failed" });
    res.json(items);
  });
};

exports.deleteMaterial = (req, res) => {
  const id = req.params.id;
  learningMaterialModel.delete(id, (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete material" });
    res.json({ message: "Material deleted successfully" });
  });
};
