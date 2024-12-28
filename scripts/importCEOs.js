import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Immediately log that the script has started
process.stdout.write('Script starting...\n');

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'your-mongodb-uri-here';

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
        const collection = db.collection('CEO');

        // Clear existing data
        await collection.deleteMany({});
        process.stdout.write('Cleared existing CEO collection\n');

        // Get list of CEO files
        const ceosDir = path.join(__dirname, '..', 'src', 'data', 'ceos');
        const files = fs.readdirSync(ceosDir);
        process.stdout.write(`Found ${files.length} files in directory\n`);

        // Import each CEO
        for (const file of files) {
            if (file.endsWith('.json') && file !== 'index.ts') {
                process.stdout.write(`Processing ${file}...\n`);
                const filePath = path.join(ceosDir, file);
                const ceoData = readJsonFile(filePath);
                
                if (ceoData) {
                    try {
                        await collection.insertOne(ceoData);
                        process.stdout.write(`Successfully imported ${file}\n`);
                    } catch (insertError) {
                        process.stdout.write(`Error inserting ${file}: ${insertError}\n`);
                    }
                }
            }
        }

        // Verify import
        const count = await collection.countDocuments();
        process.stdout.write(`\nTotal CEOs in database: ${count}\n`);

        const ceos = await collection.find({}).toArray();
        process.stdout.write('\nImported CEOs:\n');
        ceos.forEach(ceo => {
            process.stdout.write(`- ${ceo.name || 'Unnamed CEO'}\n`);
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
