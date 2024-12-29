import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

function extractDomainFromUrl(url) {
  try {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch (error) {
    console.warn('Invalid URL:', url);
    return null;
  }
}

async function updateCompanyUrls() {
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
    
    // Update each company's domain and logo URL
    for (const company of companies) {
      let needsUpdate = false;
      const updates = {};

      // Only process companies that have a URL
      if (company.url) {
        const domain = extractDomainFromUrl(company.url);
        if (domain) {
          updates.domain = domain;
          updates.logo = `https://logo.clearbit.com/${domain}`;
          needsUpdate = true;
        }
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
        console.log(`Updated company ${company.name || 'Unknown'}:`, updates);
      }
    }

    console.log('Finished updating company domains and logos');

  } catch (error) {
    console.error('Error updating companies:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
  }
}

updateCompanyUrls().catch(console.error); 