// @ts-check
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '../.env' });

async function viewAllData() {
  let client;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(process.env.MONGODB_DB_NAME || 'Plugilo');
    console.log('\nConnected to database:', process.env.MONGODB_DB_NAME);

    // List all collections
    console.log('\nCollections in database:');
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => c.name));

    // View Companies
    console.log('\n=== Companies ===');
    const companies = await db.collection('Company').find({}).toArray();
    console.log(`Found ${companies.length} companies`);
    
    if (companies.length > 0) {
      companies.forEach(company => {
        console.log(`\nCompany: ${company.name || 'Unnamed'}`);
        console.log(JSON.stringify(company, null, 2));
      });
    } else {
      console.log('No companies found in database');
    }

    // View Users
    console.log('\n=== Users ===');
    const users = await db.collection('User').find({}).toArray();
    console.log(`Found ${users.length} users`);
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`\nUser: ${user.username || 'No username'}`);
        // Omit password from display for security
        const { password, ...safeUser } = user;
        console.log(JSON.stringify(safeUser, null, 2));
      });
    } else {
      console.log('No users found in database');
    }

  } catch (error) {
    console.error('Error viewing database:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
    process.exit(0);
  }
}

// Execute the function
viewAllData().catch(console.error); 