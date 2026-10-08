const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('./database/chpa.db');

db.serialize(() => {
    db.all("PRAGMA table_info(users)", (err, uRows) => {
        const uCols = (uRows || []).map(r => r.name);
        db.all("PRAGMA table_info(heritage_items)", (err, iRows) => {
            const iCols = (iRows || []).map(r => r.name);
            const report = `USERS_COLS: ${uCols.join(',')}\nITEMS_COLS: ${iCols.join(',')}`;
            fs.writeFileSync('db_report.txt', report);
            db.close();
        });
    });
});
