const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;
const secretKey = "fs8dgf67bdf98sfag";

app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());

// Verbindung zur SQLite-Datenbank herstellen
const dbPath = "./database/spieler.db";
const db = new sqlite3.Database(dbPath);

// Middleware zum Überprüfen des JWT-Token
function verifySpieler(req, res, next) {
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

function verifyModerator(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;
    jwt.verify(req.token, secretKey, (err, authData) => {
      if (err || !(authData.role === "moderator" || authData.role === "admin")) {
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

function verifyAdmin(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;
    jwt.verify(req.token, secretKey, (err, authData) => {
      if (err || authData.role !== "admin") {
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
      "d91adaa9609190410dc2ac4a3789ff86d9e1ba54bfedbc906f102cbe19d5bbeb", //Alftal!123
    role: "admin",
  },
  {
    id: 2,
    username: "Spieler",
    password:
      "ec356f786eae8b8c2a6fcef8a8a98a2a5c6d8bdfe56f42dc43116709b6591fd5", // sgalftal
    role: "basic",
  },
  {
    id: 3,
    username: "Moderator",
    password:
      "4a7584effec8c05d5fdc1c5d584936a0e818654387120c3f201f38fe5379fe34", //Mod!123
    role: "moderator",
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

app.post("/api/anwenden_admin", verifyAdmin, (req, res) => {
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

app.post("/api/anwenden_mod", verifyModerator, (req, res) => {
  const updatedRows = req.body;
  const vornameArray = req.body.vornamen;
  const nachnameArray = req.body.nachnamen;

  if (updatedRows.bier >= 0 && updatedRows.sonstige_kosten >= 0 && updatedRows.softdrinks >= 0) {
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
  } else {
    console.error("Error Moderator: Negative Zahlen benutzt");
    db.serialize(() => {
      // Execute the third statement after the second one completes
      db.all("SELECT * FROM Spieler ORDER BY nachname", (err, rows) => {
        if (err) {
          console.error("Error:", err.message);
        } else {
          res.json(rows);
        }
      });
    });
  }
});

app.post("/api/spielerloeschen", verifyAdmin, (req, res) => {
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

app.post("/api/abrechnen", verifyAdmin, (req, res) => {
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

app.post("/api/neuer_spieler", verifyAdmin, (req, res) => {
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
app.get("/api/table", verifySpieler, (req, res) => {
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
app.get("/api/history", verifyModerator, (req, res) => {
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
