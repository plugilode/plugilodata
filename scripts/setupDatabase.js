import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const sampleCompanies = [
  {
    name: "TechCorp",
    domain: "techcorp.com",
    subject: "Technology Solutions",
    status: "ACTIVE",
    level: "PUBLIC",
    country: "Germany",
    city: "Berlin",
    description: "Leading technology solutions provider",
    logo: "https://example.com/logo1.png",
    category: ["TECHNOLOGY", "SOFTWARE"],
    tags: ["cloud", "AI", "enterprise"]
  },
  {
    name: "DataSys",
    domain: "datasys.io",
    subject: "Data Analytics",
    status: "ACTIVE",
    level: "PUBLIC",
    country: "USA",
    city: "San Francisco",
    description: "Data analytics and visualization platform",
    logo: "https://example.com/logo2.png",
    category: ["DATA", "ANALYTICS"],
    tags: ["big data", "machine learning", "visualization"]
  }
];

const sampleUsers = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin123", // In production, use hashed passwords
    role: "ADMIN",
    name: "Admin User"
  },
  {
    username: "user",
    email: "user@example.com",
    password: "user123",
    role: "USER",
    name: "Regular User"
  }
];

async function setupDatabase() {
  let client;

  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(process.env.MONGODB_URI, { tlsAllowInvalidCertificates: true });
    await client.connect();
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    console.log('Connected to database:', process.env.MONGODB_DB_NAME);

    // Create collections if they don't exist
    await db.createCollection('Company');
    await db.createCollection('User');
    
    // Clear existing data
    await db.collection('Company').deleteMany({});
    await db.collection('User').deleteMany({});

    // Insert sample data
    await db.collection('Company').insertMany(sampleCompanies);
    await db.collection('User').insertMany(sampleUsers);

    console.log('Sample data inserted successfully');
    
    // Verify data
    const companyCount = await db.collection('Company').countDocuments();
    const userCount = await db.collection('User').countDocuments();
    
    console.log(`Inserted ${companyCount} companies and ${userCount} users`);

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

setupDatabase();
