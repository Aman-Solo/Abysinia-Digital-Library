const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

require("./database/db");

// Import Routes (These will need to be updated to use MiniRouter) if we finish on time
const authRoutes = require("./routes/authRoutes");
const learningMaterialRoutes = require("./routes/learningMaterialRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const contactRoutes = require("./routes/contactRoutes");
const MiniRouter = require("./utils/miniRouter");

const PORT = 3001;

const server = http.createServer(async (req, res) => {
    req.on('error', (err) => {
        console.error(`Request Error: ${err.message}`);
    });
    res.on('error', (err) => {
        console.error(`Response Error: ${err.message}`);
    });

    // 1. CORS Middleware Cross Orign Resource Sharing middleware
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, role, Authorization");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // 2. Logging Middleware
    console.log(`Request: ${req.method} ${req.url}`);

    // 3. Static File Serving for upload files
    if (req.url.startsWith("/uploads/")) {
        let decodedUrl;
        try {
            decodedUrl = decodeURIComponent(req.url);
        } catch (e) {
            console.error(`Malicous/Bad URL: ${req.url}`);
            res.statusCode = 400;
            res.end("Bad Request");
            return;
        }


        const safeSuffix = path.normalize(decodedUrl).replace(/^(\.\.[\/\\])+/, '');
        const filePath = path.join(__dirname, safeSuffix);

        // Double check against directory traversal
        if (!filePath.startsWith(path.join(__dirname, "uploads"))) {
            console.warn(`Blocked traversal attempt: ${req.url}`);
            res.statusCode = 403;
            res.end("Forbidden");
            return;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log(`Static Access 404: ${decodedUrl}`);
                    if (!res.writableEnded) {
                        res.statusCode = 404;
                        res.end("File not found");
                    }
                } else {
                    console.error(`Static Access Error: ${err.message}`);
                    if (!res.writableEnded) {
                        res.statusCode = 500;
                        res.end("Server Error");
                    }
                }
            } else {
                console.log(`Static Access: ${req.url}`);
                // Basic mime type detection
                const ext = path.extname(filePath).toLowerCase();
                let contentType = "application/octet-stream";
                if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
                else if (ext === ".png") contentType = "image/png";
                else if (ext === ".gif") contentType = "image/gif";
                else if (ext === ".webp") contentType = "image/webp";
                else if (ext === ".pdf") contentType = "application/pdf";

                if (!res.writableEnded) {
                    res.setHeader("Content-Type", contentType);
                    res.end(data);
                }
            }
        });
        return;
    }

    // 4. Body Parsing Middleware (JSON) 
    await new Promise((resolve, reject) => {
        if (req.method === 'POST' || req.method === 'PUT') {
            const contentType = req.headers['content-type'];
            if (contentType && contentType.includes('application/json')) {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        req.body = JSON.parse(body);
                    } catch (e) {
                        req.body = {};
                        console.error("Failed to parse JSON body");
                    }
                    resolve();
                });
                // Note: error listener already attached at top so please try to find it when explaining things
            } else {
                req.body = {};
                resolve();
            }
        } else {
            req.body = {};
            resolve();
        }
    });


    // 5. Route Handling

    const router = new MiniRouter();
    router.augmentResponse(res);
    router.augmentRequest(req, '');

    try {
        const pathname = url.parse(req.url).pathname;

        if (pathname === "/test") {
            res.json({ ok: true });
            return;
        }

        // Route delegation stuffs
        if (pathname.startsWith("/auth")) {
            await authRoutes.handle(req, res, "/auth");
        } else if (pathname.startsWith("/materials")) {
            await learningMaterialRoutes.handle(req, res, "/materials");
        } else if (pathname.startsWith("/bookmarks")) {
            await bookmarkRoutes.handle(req, res, "/bookmarks");
        } else if (pathname.startsWith("/user")) {
            await userRoutes.handle(req, res, "/user");
        } else if (pathname.startsWith("/notifications")) {
            await notificationRoutes.handle(req, res, "/notifications");
        } else if (pathname.startsWith("/media")) {
            await mediaRoutes.handle(req, res, "/media");
        } else if (pathname.startsWith("/quizzes")) {
            await quizRoutes.handle(req, res, "/quizzes");
        } else if (pathname.startsWith("/contact")) {
            await contactRoutes.handle(req, res, "/contact");
        } else {
            res.status(404).json({ message: "Route not found" });
        }

    } catch (error) {
        console.error("Global Server Error:", error);
        if (!res.writableEnded) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
