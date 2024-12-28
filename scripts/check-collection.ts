import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkCollection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // List all collections
    const collections = await mongoose.connection.db.collections();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.collectionName}`);
    });

    // Get sample document from companies collection
    const companiesCollection = mongoose.connection.db.collection('companies');
    const sample = await companiesCollection.findOne({});
    console.log('\nSample document from companies collection:', sample);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCollection(); 