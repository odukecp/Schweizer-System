const express = require("express");
const db = require("./db");
const cors = require("cors");
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

// ------------------------------------------------
// -------------------- GET -----------------------
// ------------------------------------------------

app.get("/api/players", (req, res) => {
  db.db.all("SELECT * FROM players", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});


// ------------------------------------------------
// -------------------- POST ----------------------
// ------------------------------------------------

app.post("/api/create-round", (req, res) => {
  const roundIndex = req.query.index;
  if (!roundIndex) {
    return res.status(400).json({ error: "Missing round-index"});
  }

  db.createRound(roundIndex); 
  res.json({ message: `Table ${roundIndex} created`});
});

app.post("/api/add-player", (req, res) => {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  const rating = req.query.rating;
  const club = req.query.club;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "Missing first or last name"});
  }

  db.addPlayerDB(firstName, lastName, rating, club);

  res.json({ message: `Added player ${firstName} ${lastName}` })
});


// ------------------------------------------------
// ------------------- DELETE ---------------------
// ------------------------------------------------

app.delete("/api/delete-player", (req, res) => {
  const idToDelete = req.query.id;
  if (!idToDelete) {
    return res.status(400).json({ error: "Missing player id"});
  }

  db.deletePlayerDB(idToDelete);

  res.json({ message: `Deleted player with id ${idToDelete}` });
})

app.delete("/api/delete-all-players", (req, res) => {
  db.deleteAllPlayersDB();

  res.json({ message: "Deleted all players"});
})



// ------------------------------------------------
// ------------------- LISTEN ---------------------
// ------------------------------------------------

app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
});
