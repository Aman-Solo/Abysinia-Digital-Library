const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database/chpa.db');
const db = new sqlite3.Database(dbPath);

console.log("--- STARTING DATABASE REPAIR ---");

db.serialize(() => {
    // 1. Repair Users Table
    db.all("PRAGMA table_info(users)", (err, rows) => {
        if (err) throw err;
        const columns = rows.map(r => r.name);
        if (!columns.includes('bio')) {
            console.log("Adding column: bio to users");
            db.run("ALTER TABLE users ADD COLUMN bio TEXT");
        }
        if (!columns.includes('age')) {
            console.log("Adding column: age to users");
            db.run("ALTER TABLE users ADD COLUMN age INTEGER");
        }
    });

    // 2. Repair Heritage Items Table
    db.all("PRAGMA table_info(heritage_items)", (err, rows) => {
        if (err) throw err;
        const columns = rows.map(r => r.name);
        if (!columns.includes('rejection_reason')) {
            console.log("Adding column: rejection_reason to heritage_items");
            db.run("ALTER TABLE heritage_items ADD COLUMN rejection_reason TEXT");
        }
    });

    // 3. Final Verification
    setTimeout(() => {
        db.all("PRAGMA table_info(users)", (err, uRows) => {
            db.all("PRAGMA table_info(heritage_items)", (err, iRows) => {
                console.log("Users Final:", uRows.map(r => r.name).join(", "));
                console.log("Items Final:", iRows.map(r => r.name).join(", "));
                console.log("--- REPAIR COMPLETE ---");
                db.close();
            });
        });
    }, 1000);
});
