//"StAuth10244: I Young Sang Kwon, 000847777 certify that this material is my original work. 
//No other person's work has been used without due acknowledgement. 
//I have not made my work available to anyone else."

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run('CREATE TABLE users (username TEXT, password TEXT)');
});

const redisClient = redis.createClient({
  host: '192.168.2.34',
  port: 6379
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      res.status(500).json({ status: 'error', message: err.message });
    } else {
      if (row) {
        if (row.password === password) {
          res.json({ status: 'success' }); 
        } else {
          res.json({ status: 'failure', message: 'Password incorrect' });
        }
      } else {
        res.json({ status: 'failure', message: 'User not found' });
      }
    }
  });
});


app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      res.status(500).json({ status: 'error', message: err.message });
    } else {
      res.json({ status: 'success' });
    }
  });
});

app.post('/update', async (req, res) => {
  const { username, result } = req.body;

  if (result === 'correct') {
    await redisClient.lpush('leaderboard', username);
    await redisClient.ltrim('leaderboard', 0, 9);
  }

  const leaders = await redisClient.lrange('leaderboard', 0, -1);
  res.json({ leaders });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
