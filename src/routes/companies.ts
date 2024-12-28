import express from 'express';
import { CompanyModel } from '../models/company.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

interface SearchQuery {
  query?: string;
  page?: string;
  limit?: string;
  sort?: string;
  industry?: string;
  country?: string;
  company_size?: string;
}

// Get companies with search
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query, industry, country, company_size } = req.query as SearchQuery;

    // Build search query for MongoDB Company collection
    let searchQuery: any = {};

    // Basic text search in Company collection
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { domain: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { industry: { $regex: query, $options: 'i' } },
        { sub_industry: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { 'oem.categories': { $regex: query, $options: 'i' } },
        { services: { $regex: query, $options: 'i' } },
        { products: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } }
      ];
    }

    // Add filters
    if (industry) {
      searchQuery.industry = { $regex: industry, $options: 'i' };
    }

    if (country) {
      searchQuery.country = { $regex: country, $options: 'i' };
    }

    if (company_size) {
      searchQuery.company_size = company_size;
    }

    console.log('Search query:', JSON.stringify(searchQuery, null, 2));

    // Execute search
    const results = await CompanyModel.find(searchQuery)
      .limit(20)
      .select('-__v')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: results,
      total: results.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search companies' 
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.json([]);
    }

    const suggestions = await CompanyModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { domain: { $regex: query, $options: 'i' } },
        { industry: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
      .limit(8)
      .select('name domain industry country')
      .sort({ name: 1 });

    // Return more detailed suggestions
    const results = suggestions.map(s => ({
      name: s.name,
      domain: s.domain,
      industry: s.industry,
      location: s.country ? `${s.city || ''}, ${s.country}`.trim() : undefined
    }));

    res.json(results);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch suggestions' });
  }
});

export const companiesRouter = router;