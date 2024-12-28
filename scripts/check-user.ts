import { connectToDatabase } from '../src/db/index.js';
import { UserModel } from '../src/models/user.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkUser(username: string) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log(`Looking for user: ${username}`);
    const user = await UserModel.findOne({ username });
    
    if (user) {
      console.log('User found:', {
        id: user._id,
        username: user.username,
        role: user.role,
        hasPassword: !!user.password,
        email: user.email
      });
    } else {
      console.log('User not found');
    }
    
    // List all users in the database
    console.log('\nAll users in database:');
    const allUsers = await UserModel.find({}, { password: 0 });
    console.log(allUsers.map(u => ({
      username: u.username,
      role: u.role,
      email: u.email
    })));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Get username from command line argument
const username = process.argv[2];
if (!username) {
  console.error('Please provide a username as an argument');
  process.exit(1);
}

checkUser(username); 