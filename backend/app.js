const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// parse CORS origins from .env; allow all if none set
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// export app for server.js to use
module.exports = app;