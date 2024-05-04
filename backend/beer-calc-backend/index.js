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
  const updatedRows = req.body;
  const vornameArray = req.body.vornamen;
  const nachnameArray = req.body.nachnamen;

  db.serialize(() => {
    
    db.run(`UPDATE Spieler
    SET bier = bier + ${updatedRows.bier},
        softdrinks = softdrinks + ${updatedRows.softdrinks},
        sonstige_kosten = ROUND(sonstige_kosten + ${updatedRows.sonstige_kosten}, 2)
    WHERE key IN (${updatedRows.keys})`);

    // Execute the second statement after the first one completes
    db.run(
      "UPDATE Spieler SET gesamtkosten = (bier * 1.5) + softdrinks + sonstige_kosten + monatsbeitrag"
    );

    for (
      let i = 0;
      i < Math.min(vornameArray.length, nachnameArray.length);
      i++
    ) {
      const data = {
        $vorname: vornameArray[i],
        $nachname: nachnameArray[i],
        $bier: updatedRows.bier,
        $softdrinks: updatedRows.softdrinks,
        $sonstige_kosten: Math.round(updatedRows.sonstige_kosten * 100) / 100,
        $type: "Bearbeitet",
      };
      // Execute the insert query
      const insertQuery = `INSERT INTO Historie (vorname, nachname, bier, softdrinks, sonstige_kosten, type)
                           VALUES ($vorname, $nachname, $bier, $softdrinks, $sonstige_kosten, $type)
                            `;
      db.run(insertQuery, data, function (err) {
        if (err) {
          console.error("Error inserting row:", err.message);
        } else {
        }
      });
    }

    // Execute the third statement after the second one completes
    db.all("SELECT * FROM Spieler ORDER BY nachname", (err, rows) => {
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
    db.all("SELECT * FROM Spieler ORDER BY nachname", (err, rows) => {
      if (err) {
        console.error("Error:", err.message);
      } else {
        res.json(rows);
      }
    });
  });
});

app.post("/api/abrechnen", verifyToken, (req, res) => {
  const updatedRows = req.body;
  const vornameArray = req.body.vornamen;
  const nachnameArray = req.body.nachnamen;

  db.serialize(() => {
    // Execute the first statement
    db.run(`UPDATE Spieler
    SET bier = 0,
        softdrinks = 0,
        sonstige_kosten = 0,
        monatsbeitrag = 0,
        gesamtkosten = 0
    WHERE key IN (${updatedRows.keys})`);

    for (
      let i = 0;
      i < Math.min(vornameArray.length, nachnameArray.length);
      i++
    ) {
      const data = {
        $vorname: vornameArray[i],
        $nachname: nachnameArray[i],
        $bier: 0,
        $softdrinks: 0,
        $sonstige_kosten: 0.0,
        $type: "Abgerechnet",
      };
      // Execute the insert query
      const insertQuery = `INSERT INTO Historie (vorname, nachname, bier, softdrinks, sonstige_kosten, type)
                           VALUES ($vorname, $nachname, $bier, $softdrinks, $sonstige_kosten, $type)
                            `;
      db.run(insertQuery, data, function (err) {
        if (err) {
          console.error("Error inserting row:", err.message);
        } else {
        }
      });
    }

    db.all("SELECT * FROM Spieler ORDER BY nachname", (err, rows) => {
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
    db.run(
      `INSERT INTO Spieler(vorname, nachname, bier, softdrinks, monatsbeitrag, sonstige_kosten, gesamtkosten, beitragspflichtig) VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,
      [updatedRow.neuerVorname, updatedRow.neuerNachname, 0, 0, 0, 0, 0, req.body.beitragspflichtig]
    );

    // Execute the third statement after the second one completes
    db.all("SELECT * FROM Spieler ORDER BY nachname", (err, rows) => {
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
  const query = "SELECT * FROM Spieler ORDER BY nachname ASC";
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

// Route zum Abrufen der Historiendaten aus der Datenbank
app.get("/api/history", verifyToken, (req, res) => {
  const query = "SELECT * FROM Historie ORDER BY timestamp DESC";

  db.all(query, (err, rows) => {
    if (err) {
      console.error(
        "Fehler beim Abrufen der Historiendaten aus der Datenbank:",
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
