import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabaseStructure() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log('Current database:', dbName);

    // List all collections
    const collections = await mongoose.connection.db.collections();
    console.log('\nCollections:');
    for (const collection of collections) {
      console.log(`- ${collection.collectionName}`);
      
      // Get sample document from each collection
      const sample = await collection.findOne({});
      if (sample) {
        console.log('  Sample document structure:', Object.keys(sample));
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabaseStructure(); 