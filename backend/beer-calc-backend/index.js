const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const secretKey = 'fs8dgf67bdf98sfag'; // Secret Key

app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

const dummyTable = [
  {
    key: "1",
    vorname: "David",
    nachname: "Nilles",
    bier: 10,
    softdrinks: 0,
    monatsbeitrag: 5,
    sonstige_kosten: 20,
    offene_kosten: 30,
    gesamtkosten: 50,
  },
  {
    key: "2",
    vorname: "Leon",
    nachname: "Kamke",
    bier: 20,
    softdrinks: 10,
    monatsbeitrag: 5,
    sonstige_kosten: 100,
    offene_kosten: 55,
    gesamtkosten: 155
  },
  {
    key: "3",
    vorname: "Horny",
    nachname: "Richi",
    bier: 1,
    softdrinks: 0,
    monatsbeitrag: 5,
    sonstige_kosten: 10,
    offene_kosten: 45,
    gesamtkosten: 55
  },
  {
    key: "4",
    vorname: "Max",
    nachname: "Muster",
    bier: 55,
    softdrinks: 2,
    monatsbeitrag: 5,
    sonstige_kosten: 34,
    offene_kosten: 78,
    gesamtkosten: 303
  },
];

// Middleware to verify JWT token
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

// Mock user database
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

// Route to handle user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Mock authentication, you should replace this with your actual authentication logic
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const payloadData = {id: user.id, username: user.username, role: user.role};
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

// Protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.authData.user });
});

// Fetch Table
app.get('/api/table', verifyToken, (req, res) => {
  // SQL Anfragen

  res.json(dummyTable);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
