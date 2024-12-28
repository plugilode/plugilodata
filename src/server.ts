// src/server.ts

import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db/index.js';
import { authRouter } from './routes/auth.js';
import { companiesRouter } from './routes/companies.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Routes
app.use('/api/companies', companiesRouter);
app.use('/api', authRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Add connection status check
app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Port:', port);
    
    await connectToDatabase();
    console.log('Database connected successfully');

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
