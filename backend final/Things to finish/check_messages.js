const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/chpa.db');
db.all("SELECT * FROM contact_messages", (err, rows) => {
    if (err) {
        console.error("Error reading contact_messages:", err);
    } else {
        console.log("Contact Messages in DB:", rows);
    }
    db.close();
});
