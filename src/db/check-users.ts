import { connectToDatabase } from './index.js';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

async function checkUsers(): Promise<void> {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    const users = await User.find({}).lean();
    
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log({
        username: user.username,
        email: user.email,
        role: user.role
      });
    });

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  }
}

checkUsers();
