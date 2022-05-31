// Create express app
const express = require("express");
const app = express();

// Auth
const { authenticateToken, generateAccessToken } = require('./utils/auth');

// Setup env variables
require('dotenv').config();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/new", authenticateToken, (req, res) => {
  const post = req.body;
  console.log(body)
  res.sendStatus(201);
})


exports.app = app;
