// server.js

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const port = 3000

const app = express();
const secretKey = 'yourSecretKey'; // Change this to your secret key

app.use(bodyParser.json());

// Mock user database
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
res.send('Hello World!')
})

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ userId: user.id }, secretKey);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Protected endpoint
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected resource accessed successfully' });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

