import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Immediately log that the script has started
process.stdout.write('Script starting...\n');

// MongoDB connection string from environment variable
const uri = process.env.MONGODB_URI;
if (!uri) {
    process.stdout.write('Error: MONGODB_URI environment variable is not set.\n');
    process.exit(1);
}

// Function to read a JSON file
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        process.stdout.write(`Error reading file ${filePath}: ${error}\n`);
        return null;
    }
};

async function main() {
    process.stdout.write('Initializing...\n');

    const client = new MongoClient(uri, {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000
    });

    try {
        process.stdout.write('Connecting to MongoDB...\n');
        await client.connect();
        process.stdout.write('Connected successfully to MongoDB\n');

        const db = client.db('Plugilo');
        const collection = db.collection('Company');

        // Clear existing data
        await collection.deleteMany({});
        process.stdout.write('Cleared existing Company collection\n');

        // Get list of company files
        const companiesDir = path.join(__dirname, '..', 'src', 'data', 'companies');
        const files = fs.readdirSync(companiesDir);
        process.stdout.write(`Found ${files.length} files in directory\n`);

        // Import each company
        for (const file of files) {
            if (file.endsWith('.json') && file !== 'index.ts') {
                process.stdout.write(`Processing ${file}...\n`);
                const filePath = path.join(companiesDir, file);
                const companyData = readJsonFile(filePath);

                if (companyData) {
                    try {
                        await collection.insertOne(companyData);
                        process.stdout.write(`Successfully imported ${file}\n`);
                    } catch (insertError) {
                        process.stdout.write(`Error inserting ${file}: ${insertError}\n`);
                    }
                }
            }
        }

        // Verify import
        const count = await collection.countDocuments();
        process.stdout.write(`\nTotal companies in database: ${count}\n`);

        const companies = await collection.find({}).toArray();
        process.stdout.write('\nImported companies:\n');
        companies.forEach(company => {
            process.stdout.write(`- ${company.name || 'Unnamed Company'}\n`);
        });

    } catch (error) {
        process.stdout.write(`\nError: ${error}\n`);
        process.stdout.write(`Error stack: ${error.stack}\n`);
    } finally {
        process.stdout.write('\nClosing connection...\n');
        await client.close();
        process.stdout.write('Connection closed\n');
    }
}

// Run the main function
main()
    .catch(error => {
        process.stdout.write(`\nFatal error: ${error}\n`);
        process.stdout.write(`Error stack: ${error.stack}\n`);
    })
    .finally(() => {
        // Add a delay before exiting to ensure we can see any error messages
        setTimeout(() => {
            process.stdout.write('Script finished.\n');
            process.exit(0);
        }, 1000);
    });

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
    process.stdout.write(`\nUnhandled rejection: ${error}\n`);
    process.stdout.write(`Error stack: ${error.stack}\n`);
});
