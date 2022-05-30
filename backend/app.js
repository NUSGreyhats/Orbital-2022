const express = require("express");
const app = express();

// Prevent cors from doing cors things
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const test_data = [
  {
    id: 1,
    title: "First note",
    body: "This is the first note.",
    author: "me",
    private: true,
  },
  {
    id: 2,
    title: "Second note",
    body: "This is the second note.",
    author: "admin",
    private: false,
  },
  {
    id: 3,
    title: "Third note",
    body: "<h1>Hack the world</h1><br /><img src onerror=\"alert('xss')\" /><img src onerror=\"document.write('You are hacked');\" />",
    author: "admin",
    private: false,
  }
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/notes", (req, res) => {
  res.send(test_data.filter((note) => !note.private));
});

app.get("/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = test_data.find((note) => note.id == id);
  res.send(note);
});

exports.app = app;
