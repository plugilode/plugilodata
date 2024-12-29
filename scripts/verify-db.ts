import mongoose from 'mongoose';
import { CompanyModel } from '../src/models/company.js';
import dotenv from 'dotenv';

dotenv.config();

async function verifyDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Check if collection exists
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));

    // Count documents
    const count = await CompanyModel.countDocuments();
    console.log('Number of companies:', count);

    // Add test company if none exist
    if (count === 0) {
      const testCompanies = [
        {
          name: 'Plugilo Technologies',
          domain: 'plugilo.com',
          description: 'AI and Machine Learning Solutions',
          country: 'Germany',
          city: 'Berlin',
          source: 'Other',
          tags: ['AI', 'Machine Learning', 'Technology'],
          company_size: 'Medium (201-1000)',
          services: ['AI Development', 'Consulting'],
          oem: {
            categories: ['Software'],
            production_capacity: 'large',
            quality_standards: ['ISO 9001']
          }
        },
        {
          name: 'TechCorp Solutions',
          domain: 'techcorp.de',
          description: 'Enterprise Software Solutions',
          country: 'Germany',
          city: 'Munich',
          source: 'Gelbe Seiten',
          tags: ['Enterprise', 'Software', 'Cloud'],
          company_size: 'Large (1001-5000)',
          services: ['Software Development', 'Cloud Services'],
          oem: {
            categories: ['Software', 'Cloud'],
            production_capacity: 'large',
            quality_standards: ['ISO 27001']
          }
        }
      ];

      await CompanyModel.insertMany(testCompanies);
      console.log('Added test companies');
    }

    // Test search
    const searchResults = await CompanyModel.find({
      $or: [
        { name: { $regex: 'tech', $options: 'i' } },
        { description: { $regex: 'tech', $options: 'i' } }
      ]
    });
    console.log('Search test results:', searchResults);

    await mongoose.disconnect();
    console.log('Database verification complete');
  } catch (error) {
    console.error('Database verification error:', error);
  }
}

verifyDatabase(); 