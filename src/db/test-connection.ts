import { connectToDatabase } from './index.js';
import mongoose from 'mongoose';

async function testConnection(): Promise<void> {
  try {
    await connectToDatabase();
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Database connection test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
