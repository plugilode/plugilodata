import { connectToDatabase } from './src/db/index.js';
import mongoose from 'mongoose';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/:[^:@]*@/, ':****@')); // Hide password
    console.log('Database name:', process.env.MONGODB_DB_NAME);
    
    await connectToDatabase();
    
    // Additional connection tests
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));
    
    console.log('MongoDB connection test successful!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

testConnection();