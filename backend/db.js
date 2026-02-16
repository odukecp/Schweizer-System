// db.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./backend/database.db", (err) => {
  if (err) {
    console.error("DB error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`
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
      lastColor TEXT DEFAULT "white"
    )
  `)
});

function createRound(roundIndex) {
  const sql = `
    CREATE TABLE IF NOT EXISTS round${roundIndex} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lastName1 TEXT NOT NULL,
      firstName1 TEXT NOT NULL,
      id1 INTEGER NOT NULL,
      lastName2 TEXT NOT NULL,
      firstName2 TEXT NOT NULL,
      id2 INTEGER NOT NULL
    )
  `;

  console.log(`Adding a table for round ${roundIndex}`);
  db.run(sql, (err) => {
    if (err) console.error(err.message);
  });
}

function addPlayerDB(firstName, lastName, rating, club) {
  const sql = `
    INSERT INTO players (firstName, lastName, rating, club)
    VALUES ("${firstName}", "${lastName}", ${rating}, "${club}");
  `;

  console.log(`Adding player ${firstName} ${lastName} with ${rating} DWZ from "${club}"`);
  db.run(sql, (err) => {
    if (err) console.error(err.message);
  });
}

function deletePlayerDB(idToDelete) {
  const sql = `
    DELETE FROM players WHERE id = ${idToDelete};
  `;

  console.log(`Deleting player with id ${idToDelete}`);
  db.run(sql, (err) => {
    if (err) console.error(err.message);
  });
}

function deleteAllPlayersDB() {
  const sql = `
    DELETE FROM players WHERE id>-1;
  `
  console.log("Deleting all players");
  db.run(sql, (err) => {
    if (err) console.error(err.message);
  });
}

module.exports = {
  db,
  createRound,
  addPlayerDB,
  deletePlayerDB,
  deleteAllPlayersDB,
};


