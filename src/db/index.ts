import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    
    // Simplified connection options
    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    };

    await mongoose.connect(uri, options);
    
    console.log('MongoDB connected successfully');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Test the connection
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));

    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
};

// Connection event handlers
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  if (error instanceof Error) {
    console.error('Error details:', error.message);
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during MongoDB disconnection:', error);
    process.exit(1);
  }
});

// Export types
export interface Company {
  _id?: string;
  name: string;
  domain: string;
  description?: string;
  logo_url?: string;
  country?: string;
  city?: string;
  industry?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface User {
  _id?: string;
  username: string;
  password: string;
  email: string;
  name: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}
