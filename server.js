const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3000;
const DB_PATH = './db/db.json';
const NOTES_HTML_PATH = '/public/notes.html';

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Display the notes HTML page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, NOTES_HTML_PATH));
});

// Return all notes from the db.json file
app.get('/api/notes', (req, res) => {
  readFromFile(DB_PATH).then((data) => res.json(JSON.parse(data)));
});

// Add a new note to db.json file and display the notes HTML page
app.post('/api/notes', (req, res) => {
  // Deconstruct body to get form values
  const { title, text } = req.body;

  // Create new notes with a unique id
  const new_note = {
    id: uuid(),
    title: title,
    text: text,
  }

  // Add new note to db.json file
  readAndAppend(new_note, DB_PATH);

  // Display notes HTML page
  res.sendFile(path.join(__dirname, NOTES_HTML_PATH));
});

// Delete a note from db.json file and display the notes HTML page
app.delete('/api/notes/:id', (req, res) => {
  // Grab the id of the note to delete
  const note_id = req.params.id;

  // Get all notes and loop through until IDs match and delete it from array
  readFromFile(DB_PATH).then((data) => {
    const notes = JSON.parse(data);
    for (var i = notes.length - 1; i > -1; i--) {
      if (notes[i].id === note_id)
          notes.splice(i, 1);
    }

    // Write new db.json file without the note that was deleted
    writeToFile(DB_PATH, notes);
    return res.sendFile(path.join(__dirname, NOTES_HTML_PATH));
  });
});

// Wildcard route to redirect all other URLs to index page
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);