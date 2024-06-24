const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'balltracker'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

const SECRET_KEY = 'your_jwt_secret_key';

// JWT verification middleware
const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.id;
    next();
  });
};

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) return res.sendStatus(500);
    res.sendStatus(201);
  });
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.sendStatus(500);
    const user = results[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.sendStatus(401);
    }
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Position route
app.post('/api/position', verifyJWT, (req, res) => {
  const { x, y, z } = req.body;
  db.query('INSERT INTO positions (x, y, z) VALUES (?, ?, ?)', [x, y, z], (err, result) => {
    if (err) return res.sendStatus(500);
    broadcastPosition({ x, y, z });
    res.sendStatus(201);
  });
});

// WebSocket server broadcast function
const broadcastPosition = (position) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(position));
    }
  });
};

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
