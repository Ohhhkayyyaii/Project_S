const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const routes = require('./routes');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : ['uhttp://localhost:3000'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// Mount API routes
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Test endpoint that frontend is trying to access
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
