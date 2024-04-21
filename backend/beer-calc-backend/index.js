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
    offene_kosten: 30,
    sonstige_kosten: 20,
  },
  {
    key: "2",
    vorname: "Leon",
    nachname: "Kamke",
    offene_kosten: 10,
    sonstige_kosten: 5,
  },
  {
    key: "3",
    vorname: "Richard",
    nachname: "Seibel",
    offene_kosten: 34,
    sonstige_kosten: 888,
  },
  {
    key: "4",
    vorname: "Max",
    nachname: "Mustermann",
    offene_kosten: 0,
    sonstige_kosten: 34,
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
  res.json(dummyTable);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
