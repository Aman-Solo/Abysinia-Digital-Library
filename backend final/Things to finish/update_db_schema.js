const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database/chpa.db');
const db = new sqlite3.Database(dbPath);

console.log("--- STARTING DATABASE UPDATE ---");

db.serialize(() => {
    db.run("PRAGMA foreign_keys=OFF");

    db.all("PRAGMA table_info(users)", (err, rows) => {
        if (err) {
            console.error("Error fetching table info:", err);
            return;
        }

        const columns = rows.map(r => r.name);
        const columnsToAdd = [
            { name: "application_status", type: "TEXT DEFAULT 'none'" },
            { name: "full_name_app", type: "TEXT" },
            { name: "credentials", type: "TEXT" },
            { name: "graduation_info", type: "TEXT" },
            { name: "id_picture", type: "TEXT" }
        ];

        columnsToAdd.forEach(col => {
            if (!columns.includes(col.name)) {
                console.log(`Adding column: ${col.name} to users`);
                db.run(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`, (err) => {
                    if (err) console.error(`Failed to add ${col.name}:`, err.message);
                    else console.log(`Successfully added ${col.name}`);
                });
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        });
    });

    // Verification
    setTimeout(() => {
        db.all("PRAGMA table_info(users)", (err, rows) => {
            console.log("Users Table Columns:", rows.map(r => r.name).join(", "));
            console.log("--- UPDATE COMPLETE ---");
            db.close();
        });
    }, 2000);
});
