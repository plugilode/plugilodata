import { connectToDatabase } from './index.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

async function createTestUser() {
  try {
    await connectToDatabase();
    
    const testUser = new User({
      username: 'admin',
      password: 'admin123',  // This will be hashed automatically
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin'
    });

    await testUser.save();
    console.log('Test user created successfully');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser(); 