import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection string
const uri = 'mongodb+srv://Error2:Patrick82@cluster0.qhmi5.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'test';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function main() {
  const client = new MongoClient(uri);

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('companies');

    // Path to the companies directory
    const companiesDir = path.join(__dirname, '..', 'src', 'data', 'companies');
    console.log(`Reading companies from: ${companiesDir}`);

    // Read all files in the directory
    const files = fs.readdirSync(companiesDir);
    console.log(`Found ${files.length} files in directory`);

    let importedCount = 0;
    for (const file of files) {
      if (path.extname(file) === '.json' && file !== 'index.ts') {
        try {
          const filePath = path.join(companiesDir, file);
          console.log(`Processing file: ${file}`);
          
          const data = fs.readFileSync(filePath, 'utf8');
          const json = JSON.parse(data);

          // Insert the JSON data into the collection
          const result = await collection.insertOne(json);
          console.log(`Successfully inserted ${file} with _id: ${result.insertedId}`);
          importedCount++;
        } catch (fileError) {
          console.error(`Error processing file ${file}:`, fileError);
        }
      }
    }

    console.log(`\nImport Summary:`);
    console.log(`Total files found: ${files.length}`);
    console.log(`Successfully imported: ${importedCount} companies`);

    // Verify the import by counting documents
    const count = await collection.countDocuments();
    console.log(`Total documents in collection: ${count}`);

    // List all imported companies
    console.log('\nListing all companies in database:');
    const companies = await collection.find({}).toArray();
    companies.forEach(company => {
      console.log(`- ${company.name || 'Unnamed Company'}`);
    });

  } catch (err) {
    console.error('MongoDB Error:', err);
    process.exit(1);
  } finally {
    console.log('\nClosing MongoDB connection...');
    await client.close();
    console.log('Connection closed');
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
