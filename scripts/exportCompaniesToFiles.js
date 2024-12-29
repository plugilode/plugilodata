// scripts/exportCompaniesToFiles.js

const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

// Replace with your MongoDB connection string and database name
const uri = 'mongodb://localhost:27017';
const dbName = 'your_database_name';

async function exportCompanies() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const companiesCollection = db.collection('Companies');

    const companies = await companiesCollection.find().toArray();
    console.log(`Fetched ${companies.length} companies`);

    const outputDir = path.join(__dirname, '..', 'src', 'data', 'companies');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Delete existing JSON files (except index.ts)
    fs.readdirSync(outputDir).forEach((file) => {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(outputDir, file));
      }
    });

    const importStatements = [];
    const companyArrayEntries = [];

    // Write each company to a separate JSON file
    for (const company of companies) {
      const sanitizedFileName = company.name
        .replace(/[\\/:"*?<>| ]+/g, '_')
        .toLowerCase();
      const fileName = `${sanitizedFileName}.json`;
      const filePath = path.join(outputDir, fileName);

      fs.writeFileSync(filePath, JSON.stringify(company, null, 2));

      const variableName = sanitizedFileName;
      importStatements.push(`import ${variableName} from './${fileName}';`);
      companyArrayEntries.push(variableName);
    }

    // Generate index.ts file
    const indexContent = `import { Record } from '../../types';

${importStatements.join('\n')}

// Export array of all companies
export const companies: Record[] = [
  ${companyArrayEntries.join(',\n  ')}
];
`;

    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);

    console.log('Companies exported successfully');
  } catch (err) {
    console.error('Error exporting companies:', err);
  } finally {
    await client.close();
  }
}

exportCompanies();
