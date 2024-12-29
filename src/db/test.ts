import { connectToDatabase } from './index.js';
import { Collection } from 'mongodb';

async function testConnection() {
  try {
    await connectToDatabase();
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Database connection test failed:', error);
    process.exit(1);
  }
}

testConnection();