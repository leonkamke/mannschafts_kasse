const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const secretKey = 'fs8dgf67bdf98sfag'; // Secret Key

app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

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
    password: 'Admin!123'
  },
  {
    id: 2,
    username: 'User',
    password: 'User!123'
  }
];

// Route to handle user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Mock authentication, you should replace this with your actual authentication logic
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
