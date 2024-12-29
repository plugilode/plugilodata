import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

async function updatePlugiloRecord() {
  let client;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(process.env.MONGODB_DB_NAME || 'Plugilo');
    
    // Update Plugilo's record
    const result = await db.collection('Company').updateOne(
      { name: 'Plugilo' },
      { 
        $set: { 
          url: 'https://plugilo.com',
          domain: 'plugilo.com',
          logo: 'https://logo.clearbit.com/plugilo.com',
          updated_at: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log('Successfully updated Plugilo record');
    } else {
      console.log('No matching record found for Plugilo');
    }

  } catch (error) {
    console.error('Error updating Plugilo record:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
  }
}

updatePlugiloRecord().catch(console.error); 