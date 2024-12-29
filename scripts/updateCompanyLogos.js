import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

async function updateCompanyLogos() {
  let client;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(process.env.MONGODB_DB_NAME || 'Plugilo');
    
    // Get all companies
    const companies = await db.collection('Company').find({}).toArray();
    console.log(`Found ${companies.length} companies to update`);
    
    // Update each company's logo URL
    for (const company of companies) {
      let needsUpdate = false;
      const updates = {};

      // Check if the company has a URL or domain
      if (company.url) {
        updates.logo = `https://logo.clearbit.com/${company.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
        needsUpdate = true;
      } else if (company.domain) {
        updates.logo = `https://logo.clearbit.com/${company.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await db.collection('Company').updateOne(
          { _id: company._id },
          { 
            $set: { 
              ...updates,
              updated_at: new Date()
            } 
          }
        );
        console.log(`Updated logo for ${company.name || 'Unnamed'}:`, updates.logo);
      }
    }

    console.log('Finished updating company logos');

  } catch (error) {
    console.error('Error updating company logos:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
  }
}

updateCompanyLogos().catch(console.error); 