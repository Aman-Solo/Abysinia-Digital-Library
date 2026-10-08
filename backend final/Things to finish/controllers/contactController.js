const contactModel = require("../models/contactModel");

exports.submitMessage = (req, res) => {
    console.log("Received contact submission:", req.body);
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        console.warn("Contact submission missing fields:", { name, email, message });
        return res.status(400).json({ message: "Name, email and message are required." });
    }

    contactModel.createMessage({ name, email, subject, message }, (err, id) => {
        if (err) {
            console.error("Database error in createMessage:", err);
            return res.status(500).json({ message: "Database error" });
        }
        console.log("Contact message saved with ID:", id);
        res.status(201).json({ message: "Message sent successfully!", id });
    });
};

exports.getMessages = (req, res) => {
    contactModel.getAllMessages((err, rows) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json(rows);
    });
};

exports.removeMessage = (req, res) => {
    const { id } = req.params;
    contactModel.deleteMessage(id, (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json({ message: "Message deleted" });
    });
};
