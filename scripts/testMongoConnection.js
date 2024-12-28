import { MongoClient } from 'mongodb';

console.error('Script started');

const uri = 'mongodb+srv://Error2:Patrick82@cluster0.qhmi5.mongodb.net/test?retryWrites=true&w=majority';

async function testConnection() {
    console.error('Creating MongoDB client');
const client = new MongoClient(uri, { tlsAllowInvalidCertificates: true });

    try {
        console.error('Attempting to connect...');
        await client.connect();
        console.error('Connected successfully');

const db = client.db('Plugilo');
const collection = db.collection('User');
await collection.insertOne({ username: 'pblanks', password: 'Patrick82' });
console.error('User pblanks added successfully');

const user = await collection.findOne({ username: 'pblanks' });
console.error('Retrieved user:', user);

const userCount = await collection.countDocuments();
console.error('Number of users in the User collection after insertion:', userCount);

    } catch (err) {
        console.error('Connection error:', err);
    } finally {
        console.error('Closing connection');
        await client.close();
        console.error('Connection closed');
    }
}

testConnection().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
