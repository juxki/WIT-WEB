const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { poolPromise, sql } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from root folder

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/register', async (req, res) => {
  const { name, email } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('Name', sql.VarChar, name)
      .input('Email', sql.VarChar, email)
      .query('INSERT INTO Users (Name, Email) VALUES (@Name, @Email)');

    res.send('✅ Registration successful!');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Registration failed.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
