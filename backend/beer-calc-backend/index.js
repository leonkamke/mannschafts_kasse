const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const secretKey = 'fs8dgf67bdf98sfag'; // Secret Key

app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

// Verbindung zur SQLite-Datenbank herstellen
const dbPath = 'spieler.db';
const db = new sqlite3.Database(dbPath);

// Middleware zum Überprüfen des JWT-Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    jwt.verify(req.token, secretKey, (err, authData) => {
      if (err) {
        res.sendStatus(403); // Forbidden
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
}

// Mock-Benutzerdaten
const users = [
  {
    id: 1,
    username: 'Admin',
    password: 'Admin!123',
    role: 'admin'
  },
  {
    id: 2,
    username: 'User',
    password: 'User!123',
    role: 'basic'
  }
];

// Route zur Bearbeitung der Benutzeranmeldung
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Mock-Authentifizierung, sollte durch echte Authentifizierungslogik ersetzt werden
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const payloadData = { id: user.id, username: user.username, role: user.role };
    jwt.sign(payloadData, secretKey, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        res.status(500).json({ error: 'Failed to generate token' });
      } else {
        res.json({ token });
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

app.post('/api/anwenden', verifyToken, (req, res) => {
  const updatedRow = req.body;
  
});


// Geschützte Route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.authData.user });
});

// Route zum Abrufen der Spielerdaten aus der Datenbank
app.get('/api/table', verifyToken, (req, res) => {
  const query = 'SELECT * FROM Spieler';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Fehler beim Abrufen der Spielerdaten aus der Datenbank:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
