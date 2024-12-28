import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Error2:Patrick82@cluster0.qhmi5.mongodb.net';
const dbName = 'test';

async function main() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('companies');

    // Count documents
    const count = await collection.countDocuments();
    console.log(`Number of companies in database: ${count}`);

    // List all company names
    const companies = await collection.find({}).toArray();
    console.log('\nCompanies imported:');
    companies.forEach(company => {
      console.log(`- ${company.name}`);
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
