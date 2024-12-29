import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

async function updateUser() {
  let client;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(process.env.MONGODB_DB_NAME || 'Plugilo');
    
    // Update the user to include password
    const result = await db.collection('User').updateOne(
      { username: "user" },
      { 
        $set: { 
          password: "user123",  // This is from our setup script
          updated_at: new Date()
        } 
      }
    );

    console.log('User update result:', result);

    // Verify the update
    const updatedUser = await db.collection('User').findOne({ username: "user" });
    console.log('Updated user:', updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
  }
}

updateUser().catch(console.error); 