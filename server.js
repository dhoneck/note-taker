const express = require('express');
const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');


const PORT = 3000;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
  console.log('Trying to post to /api/notes');
  const response = {
    status: 'success',
    body: req.body
  }
  readAndAppend(req.body, './db/db.json');
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);