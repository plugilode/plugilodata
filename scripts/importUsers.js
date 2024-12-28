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
        const collection = db.collection('User');

        // Clear existing data
        await collection.deleteMany({});
        process.stdout.write('Cleared existing User collection\n');

        // Read users.json file
        const usersFilePath = path.join(__dirname, '..', 'src', 'data', 'users.json');
        process.stdout.write(`Reading users from: ${usersFilePath}\n`);

        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            const users = JSON.parse(data);

            if (Array.isArray(users)) {
                const result = await collection.insertMany(users);
                process.stdout.write(`Successfully imported ${result.insertedCount} users\n`);
            } else {
                process.stdout.write('User data is not an array\n');
            }
        } else {
            process.stdout.write(`File not found: ${usersFilePath}\n`);
        }

        // Verify import
        const count = await collection.countDocuments();
        process.stdout.write(`\nTotal users in database: ${count}\n`);

        const allUsers = await collection.find({}).toArray();
        process.stdout.write('\nImported users:\n');
        allUsers.forEach(user => {
            process.stdout.write(`- ${user.name || 'Unnamed User'}\n`);
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
