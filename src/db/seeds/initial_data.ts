import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('products').del();
  await knex('contacts').del();
  await knex('companies').del();

  // Insert companies
  const [apple, microsoft, google] = await knex('companies').insert([
    {
      name: 'Apple Inc.',
      domain: 'apple.com',
      description: 'Technology company that designs, develops, and sells consumer electronics',
      logo_url: 'https://www.apple.com/ac/globalnav/7/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__b5er5ngrzxqq_large.svg',
      country: 'United States',
      city: 'Cupertino',
      industry: 'Technology'
    },
    {
      name: 'Microsoft Corporation',
      domain: 'microsoft.com',
      description: 'Technology company that develops and supports software and services',
      logo_url: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31',
      country: 'United States',
      city: 'Redmond',
      industry: 'Technology'
    },
    {
      name: 'Google LLC',
      domain: 'google.com',
      description: 'Technology company specializing in internet-related services',
      logo_url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      country: 'United States',
      city: 'Mountain View',
      industry: 'Technology'
    }
  ]).returning('id');

  // Insert contacts
  await knex('contacts').insert([
    {
      company_id: apple[0],
      name: 'Tim Cook',
      email: 'tim.cook@apple.com',
      position: 'CEO',
      phone: '+1-408-555-0123'
    },
    {
      company_id: microsoft[0],
      name: 'Satya Nadella',
      email: 'satya.nadella@microsoft.com',
      position: 'CEO',
      phone: '+1-425-555-0123'
    },
    {
      company_id: google[0],
      name: 'Sundar Pichai',
      email: 'sundar.pichai@google.com',
      position: 'CEO',
      phone: '+1-650-555-0123'
    }
  ]);

  // Insert products
  await knex('products').insert([
    {
      company_id: apple[0],
      name: 'iPhone',
      description: 'Smartphone',
      price: 999.99
    },
    {
      company_id: microsoft[0],
      name: 'Windows 11',
      description: 'Operating System',
      price: 199.99
    },
    {
      company_id: google[0],
      name: 'Google Workspace',
      description: 'Productivity Suite',
      price: 12.99
    }
  ]);
}
