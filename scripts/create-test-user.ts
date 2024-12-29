import mongoose from 'mongoose';
import { UserModel } from '../src/models/user.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const testUser = new UserModel({
      username: 'admin',
      password: 'admin123', // Will be hashed automatically
      role: 'admin'
    });

    await testUser.save();
    console.log('Test user created successfully');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser(); 