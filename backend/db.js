// db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./backend/database.db', (err) => {
    if (err) {
        console.error('DB error:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

db.serialize(() => {
    const sql = `
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            rating INTEGER DEFAULT 800,
            club TEXT,
            normalScore REAL DEFAULT 0,
            sonnebornBergerScore REAL DEFAULT 0,
            buchholzScore REAL DEFAULT 0,
            buchholzBuchholzScore REAL DEFAULT 0,
            lastColor TEXT DEFAULT "black"
        );
    `;

    db.run(sql, (err) => {
        if (err) console.error(err.message);
    });
});

async function createPairingTableDB() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS pairing (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                round INTEGER NOT NULL,
                board INTEGER NOT NULL,
                id1 INTEGER NOT NULL,
                id2 INTEGER NOT NULL,
                result REAL
            );
        `;

        db.run(sql, (err) => {
            if (err) console.error(err.message);
            return err;
        });
        return 'Pairing-table created.';
    } catch (err) {
        console.error('createPairingTableDB() failed:', err);
    }
}

async function addPairingDB(round, board, id1, id2) {
    try {
        const sql = `
            INSERT INTO pairing (round, board, id1, id2)
            VALUES (${round}, ${board}, ${id1}, ${id2});
        `;
        db.run(sql, (err) => {
            if (err) {
                console.error(err.message);
                return err;
            }
        });
        return 'New Pairing added';
    } catch (err) {
        console.error('addPairingDB() failed:', err);
    }
}

async function addPlayerDB(firstName, lastName, rating, club) {
    try {
        const sql = `
            INSERT INTO players (firstName, lastName, rating, club)
            VALUES ("${firstName}", "${lastName}", ${rating}, "${club}");
        `;

        console.log(`Adding player ${firstName} ${lastName} with ${rating} DWZ from "${club}"`);

        db.run(sql, (err) => {
            if (err) console.error(err.message);
        });
        return `Added player "${firstName}", "${lastName}", ${rating}, "${club}"`;
    } catch (err) {
        console.error('addPlayerDB() failed:', err);
    }
}

async function deletePlayerDB(idToDelete) {
    try {
        const sql = `
            DELETE FROM players WHERE id = ${idToDelete};
        `;

        console.log(`Deleting player with id ${idToDelete}`);
        db.run(sql, (err) => {
            if (err) console.error(err.message);
        });
        return `Deleted player with id ${idToDelete}`;
    } catch (err) {
        console.error('deletePlayerDB() failed:', err);
    }
}

async function deleteAllPlayersDB() {
    try {
        const sql = `
            DELETE FROM players WHERE id > -1;
        `;
        console.log('Deleting all players');
        db.run(sql, (err) => {
            if (err) {
                console.error(err.message);
                return err;
            }
        });
        return 'All players have been deleted.';
    } catch (err) {
        console.error('deleteAllPlayersDB() failed:', err);
    }
}

async function deleteAllPairingsDB() {
    try {
        const sql = `
            DELETE FROM pairing WHERE id > -1;
        `;
        console.log('Deleting all pairings');
        db.run(sql, (err) => {
            if (err) {
                console.error(err.message);
                return err;
            }
        });
        return 'All pairings have been deleted.';
    } catch (err) {
        console.error('deleteAllPairingsDB() failed:', err);
    }
}

async function createRankingDB() {
    try {
        await new Promise((resolve, reject) => {
            let sql = `
                CREATE TABLE IF NOT EXISTS ranking (
                    id INTEGER NOT NULL,
                    firstName TEXT NOT NULL,
                    lastName TEXT NOT NULL,
                    rating INTEGER NOT NULL,
                    club TEXT,
                    normalScore REAL DEFAULT 0,
                    sonnebornBergerScore REAL DEFAULT 0,
                    buchholzScore REAL DEFAULT 0,
                    buchholzBuchholzScore REAL DEFAULT 0,
                    lastColor TEXT DEFAULT "black"
                );
            `;
            db.run(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await new Promise((resolve, reject) => {
            sql = `
                DELETE FROM ranking WHERE id > -1;
            `;
            db.run(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await new Promise((resolve, reject) => {
            sql = `
                CREATE TABLE temp_ranking AS
                SELECT * FROM players ORDER BY rating DESC;
            `;
            db.run(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await new Promise((resolve, reject) => {
            sql = `
                INSERT INTO ranking
                SELECT * FROM temp_ranking;
            `;
            db.run(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await new Promise((resolve, reject) => {
            sql = `
                DROP TABLE temp_ranking;
            `;
            db.run(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log('Ranking-table created succesfully');
        return 'Ranking-table created, and filled';
    } catch (err) {
        console.error('createRankingDB() failed:', err);
    }
}

module.exports = {
    db,
    addPlayerDB,
    deletePlayerDB,
    deleteAllPlayersDB,
    createPairingTableDB,
    createRankingDB,
    addPairingDB,
    deleteAllPairingsDB,
};
