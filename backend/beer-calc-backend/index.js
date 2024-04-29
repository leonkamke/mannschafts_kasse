const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;
const secretKey = "fs8dgf67bdf98sfag"; // Secret Key

app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());

// Verbindung zur SQLite-Datenbank herstellen
const dbPath = "./database/spieler.db";
const db = new sqlite3.Database(dbPath);

// Middleware zum Überprüfen des JWT-Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
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
    username: "Admin",
    password:
      "c108a97b99c821af18f88430e1ed64d43638184c52dd6c678ae5a342d0f48fcd",
    role: "admin",
  },
  {
    id: 2,
    username: "User",
    password:
      "7c9af92a81e431548b72455e44016d5a6939f0bc25740f2f91a8a1c59cfaa4cc",
    role: "basic",
  },
];

// Route zur Bearbeitung der Benutzeranmeldung
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Mock-Authentifizierung, sollte durch echte Authentifizierungslogik ersetzt werden
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const payloadData = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    jwt.sign(payloadData, secretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        res.status(500).json({ error: "Failed to generate token" });
      } else {
        res.json({ token });
      }
    });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.post("/api/anwenden", verifyToken, (req, res) => {
  const updatedRow = req.body;

  db.serialize(() => {
    // Execute the first statement
    db.run(`UPDATE Spieler
    SET bier = bier + ${updatedRow.bier},
        softdrinks = softdrinks + ${updatedRow.softdrinks},
        sonstige_kosten = sonstige_kosten + ${updatedRow.sonstige_kosten}
    WHERE key = ${updatedRow.key}`);

    // Execute the second statement after the first one completes
    db.run(
      "UPDATE Spieler SET gesamtkosten = (bier * 1.5) + softdrinks + sonstige_kosten"
    );

    // Execute the third statement after the second one completes
    db.all("SELECT * FROM Spieler", (err, rows) => {
      if (err) {
        console.error("Error:", err.message);
      } else {
        res.json(rows);
      }
    });
  });
});

app.post("/api/spielerloeschen", verifyToken, (req, res) => {
  const updatedRow = req.body;

  db.serialize(() => {
    // Execute the first statement
    db.run(`DELETE FROM Spieler
    WHERE key = ${updatedRow.key}`);

    // Execute the third statement after the second one completes
    db.all("SELECT * FROM Spieler", (err, rows) => {
      if (err) {
        console.error("Error:", err.message);
      } else {
        res.json(rows);
      }
    });
  });
});

app.post("/api/abrechnen", verifyToken, (req, res) => {
  const updatedRow = req.body;

  db.serialize(() => {
    // Execute the first statement
    db.run(`UPDATE Spieler
    SET bier = 0,
        softdrinks = 0,
        sonstige_kosten = 0,
        gesamtkosten = 0
    WHERE key = ${updatedRow.key}`);

    // Execute the third statement after the second one completes
    db.all("SELECT * FROM Spieler", (err, rows) => {
      if (err) {
        console.error("Error:", err.message);
      } else {
        res.json(rows);
      }
    });
  });
});

app.post("/api/neuer_spieler", verifyToken, (req, res) => {
  const updatedRow = req.body;
  
  db.serialize(() => {
    // Execute the first statement
    db.run(`INSERT INTO Spieler(vorname, nachname, bier, softdrinks, monatsbeitrag, sonstige_kosten, gesamtkosten) VALUES(?, ?, ?, ?, ?, ?, ?);`, [updatedRow.neuerVorname, updatedRow.neuerNachname, 0, 0, 0, 0, 0]);

    // Execute the third statement after the second one completes
    db.all("SELECT * FROM Spieler", (err, rows) => {
      if (err) {
        console.error("Error:", err.message);
      } else {
        res.json(rows);
      }
    });
  });
});

// Route zum Abrufen der Spielerdaten aus der Datenbank
app.get("/api/table", verifyToken, (req, res) => {
  const query = "SELECT * FROM Spieler";

  db.all(query, (err, rows) => {
    if (err) {
      console.error(
        "Fehler beim Abrufen der Spielerdaten aus der Datenbank:",
        err.message
      );
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(rows);
    }
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
