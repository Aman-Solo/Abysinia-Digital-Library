// app.js
require("./database/db");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Explicitly log static file hits
app.use("/uploads", (req, res, next) => {
  console.log(`Static Access: ${req.url}`);
  next();
}, express.static("uploads"));

const authRoutes = require("./routes/authRoutes");
const heritageItemRoutes = require("./routes/heritageItemRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/auth", authRoutes);
app.use("/items", heritageItemRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/user", userRoutes);
app.use("/notifications", notificationRoutes);
app.use("/media", mediaRoutes);
app.use("/quizzes", quizRoutes);
app.use("/contact", contactRoutes);

app.get("/test", (req, res) => {
  res.json({ ok: true });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
