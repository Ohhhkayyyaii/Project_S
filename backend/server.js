const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes and middleware
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Security middleware
app.use(helmet());

// CORS configuration - allow all origins for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? 
    process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : 
    ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500', '*'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running!' });
});

// Test endpoint that frontend is trying to access
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Project Showcase API is running!' });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
