const userModel = require("../models/userModel");
const db = require("../database/db");
const bcrypt = require("bcryptjs");

exports.updateProfile = (req, res) => {
    const { id, username, email, currentPassword, newPassword, bio, age } = req.body;

    if (!id) return res.status(400).json({ message: "User ID required" });

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
        if (err || !user) return res.status(404).json({ message: "User not found" });

        let updates = [];
        let params = [];

        if (username) { updates.push("username = ?"); params.push(username); }
        if (email) { updates.push("email = ?"); params.push(email); }
        if (bio !== undefined) { updates.push("bio = ?"); params.push(bio); }
        if (age !== undefined) {
            const numericAge = parseInt(age);
            updates.push("age = ?");
            params.push(isNaN(numericAge) ? null : numericAge);
        }

        const finalizeUpdate = () => {
            if (updates.length === 0) return res.json({ message: "No changes made", user });

            params.push(id);
            const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

            db.run(sql, params, function (err) {
                if (err) {
                    console.error("DB UPDATE ERROR:", err);
                    if (err.message.includes("UNIQUE")) return res.status(409).json({ message: "Email already taken" });
                    return res.status(500).json({ message: "Database update failed" });
                }

                // Fetch fresh user to return
                db.get("SELECT id, username, email, role, bio, age FROM users WHERE id = ?", [id], (err, updatedUser) => {
                    res.json({ message: "Profile updated successfully", user: updatedUser });
                });
            });
        };

        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ message: "Current password required" });
            const isValid = bcrypt.compareSync(currentPassword, user.password);
            if (!isValid) return res.status(401).json({ message: "Incorrect current password" });

            updates.push("password = ?");
            params.push(bcrypt.hashSync(newPassword, 8));
            finalizeUpdate();
        } else {
            finalizeUpdate();
        }
    });
};

exports.getAllUsers = (req, res) => {
    userModel.getAll((err, users) => {
        if (err) return res.status(500).json({ message: "Failed to fetch users" });
        res.json(users);
    });
};

exports.updateUserRole = (req, res) => {
    const { id, role } = req.body;
    userModel.updateRole(id, role, (err) => {
        if (err) return res.status(500).json({ message: "Update failed" });
        res.json({ message: "Role updated successfully" });
    });
};

exports.deleteUser = (req, res) => {
    const id = req.params.id;
    userModel.deleteUser(id, (err) => {
        if (err) return res.status(500).json({ message: "Delete failed" });
        res.json({ message: "User deleted successfully" });
    });
};

exports.getStats = (req, res) => {
    userModel.getStats((err, stats) => {
        if (err) return res.status(500).json({ message: "Fetch failed" });
        res.json(stats);
    });
};

exports.getApplications = (req, res) => {
    userModel.getPendingApplications((err, apps) => {
        if (err) return res.status(500).json({ message: "Fetch failed" });
        res.json(apps);
    });
};

exports.approveApplication = (req, res) => {
    const id = req.params.id;
    userModel.updateApplicationStatus(id, 'approved', (err) => {
        if (err) return res.status(500).json({ message: "Action failed" });
        // After approval, trigger notification
        const db = require("../database/db");
        db.run("INSERT INTO notifications (user_id, message) VALUES (?, ?)", [id, "Congratulations! Your teacher verification has been approved."], () => {
            res.json({ message: "Application approved" });
        });
    });
};

exports.rejectApplication = (req, res) => {
    const id = req.params.id;
    userModel.updateApplicationStatus(id, 'rejected', (err) => {
        if (err) return res.status(500).json({ message: "Action failed" });
        res.json({ message: "Application rejected" });
    });
};

exports.submitApplication = (req, res) => {
    const { email, full_name_app, credentials, graduation_info } = req.body;
    if (!req.file) return res.status(400).json({ message: "ID picture is required" });

    userModel.findByEmail(email, (err, user) => {
        if (err || !user) return res.status(404).json({ message: "User not found" });

        const data = {
            id_picture: req.file.path.replace(/\\/g, "/"),
            full_name_app,
            credentials,
            graduation_info
        };

        userModel.submitApplication(user.id, data, (err) => {
            if (err) return res.status(500).json({ message: "Submission failed" });
            res.json({ message: "Application submitted successfully" });
        });
    });
};

