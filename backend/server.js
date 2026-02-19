const express = require('express');
const db = require('./db');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const app = express();

app.use(
    cors({
        origin: ['http://localhost:5500', 'null'], // Replace with your frontend's exact origin
        methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
        allowedHeaders: ['Content-Type'],
        credentials: true, // Allow credentials (cookies, auth headers)
    }),
);

app.use(express.json());

// ------------------------------------------------
// -------------------- GET -----------------------
// ------------------------------------------------

console.log(path.join(__dirname, '../frontend/index.html'));

app.get('/api/players', (req, res) => {
    db.db.all('SELECT * FROM players', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/tables', (req, res) => {
    db.db.all('SELECT name FROM sqlite_master WHERE type="table"', [], (err, tables) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(tables);
        }
    });
});

app.get('/api/ranking', (req, res) => {
    db.db.all('SELECT * FROM ranking', [], (err, players) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(players);
        }
    });
});

// ------------------------------------------------
// -------------------- POST ----------------------
// ------------------------------------------------

app.post('/api/log', (req, res) => {
    const logEntry = `${new Date().toISOString()} ${req.body.message}\n`;
    const logFilePath = path.join(__dirname, '../logs/frontend.log');
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error('Failed to write log:', err);
    });
    res.sendStatus(200);
});

app.post('/api/add-player', async (req, res) => {
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const rating = req.query.rating;
    const club = req.query.club;

    if (!firstName || !lastName) {
        return res.status(400).json({ error: 'Missing first or last name' });
    }

    const message = await db.addPlayerDB(firstName, lastName, rating, club);

    res.json({ message: message });
});

app.post('/api/add-pairing', async (req, res) => {
    const round = req.query.round;
    const board = req.query.board;
    const id1 = req.query.id1;
    const id2 = req.query.id2;

    if (!id1 || !id2) {
        return res.status(400).json({ error: 'Missing request query' });
    }

    const message = await db.addPairingDB(round, board, id1, id2);
    res.json({ message: message });
});

app.post('/api/create-ranking', async (req, res) => {
    const message = await db.createRankingDB();
    res.json({ message: message });
});

app.post('/api/create-pairing-table', async (req, res) => {
    const message = await db.createPairingTableDB();
    res.json({ message: message });
});
// ------------------------------------------------
// ------------------- DELETE ---------------------
// ------------------------------------------------

app.delete('/api/delete-player', async (req, res) => {
    const idToDelete = req.query.id;
    if (!idToDelete) {
        return res.status(400).json({ error: 'Missing player id' });
    }

    const message = await db.deletePlayerDB(idToDelete);
    res.json({ message: message });
});

app.delete('/api/delete-all-players', async (req, res) => {
    const message = await db.deleteAllPlayersDB();
    res.json({ message: message });
});

app.delete('/api/delete-all-pairings', async (req, res) => {
    const message = await db.deleteAllPairingsDB();
    res.json({ message: message });
});

// ------------------------------------------------
// ------------------- LISTEN ---------------------
// ------------------------------------------------

app.listen(PORT, () => {
    console.log('Server running on http://localhost:3000');
});
