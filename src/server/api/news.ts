import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from '../db';

const router = express.Router();

interface NewsItem {
  title: string;
  company: string;
  date: string;
  url: string;
  source: string;
}

// Cache news items with TTL
let newsCache: NewsItem[] = [];
let lastFetch: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const sources = [
  {
    url: 'https://www.handelsblatt.com/unternehmen',
    name: 'Handelsblatt',
    selector: 'article',
    titleSelector: 'h2',
    dateSelector: 'time',
    linkSelector: 'a'
  },
  {
    url: 'https://www.manager-magazin.de/unternehmen',
    name: 'Manager Magazin',
    selector: '.article-teaser',
    titleSelector: '.title',
    dateSelector: '.date',
    linkSelector: 'a'
  },
  {
    url: 'https://www.faz.net/aktuell/wirtschaft/unternehmen/',
    name: 'FAZ',
    selector: '.tsr-Base_ContentWrap',
    titleSelector: 'h2',
    dateSelector: 'time',
    linkSelector: 'a.tsr-Base_ContentLink'
  },
  {
    url: 'https://www.wiwo.de/unternehmen',
    name: 'WirtschaftsWoche',
    selector: '.c-teaser',
    titleSelector: '.c-teaser__headline',
    dateSelector: '.c-teaser__time',
    linkSelector: 'a'
  },
  {
    url: 'https://www.reuters.com/news/archive/germany-companies',
    name: 'Reuters DE',
    selector: 'article',
    titleSelector: '.story-title',
    dateSelector: 'time',
    linkSelector: 'a'
  }
];

async function scrapeNews(): Promise<NewsItem[]> {
  const news: NewsItem[] = [];
  const seenUrls = new Set<string>();

  for (const source of sources) {
    try {
      console.log(`Scraping ${source.name}...`);
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      $(source.selector).each((_, element) => {
        const title = $(element).find(source.titleSelector).text().trim();
        const url = $(element).find(source.linkSelector).attr('href') || '';
        const dateText = $(element).find(source.dateSelector).text().trim();
        
        // Extract company name from title using company database
        const company = extractCompanyName(title);
        const fullUrl = url.startsWith('http') ? url : `${new URL(source.url).origin}${url}`;
        
        if (company && title && url && !seenUrls.has(fullUrl)) {
          seenUrls.add(fullUrl);
          news.push({
            title,
            company,
            date: formatDate(dateText),
            url: fullUrl,
            source: source.name
          });
        }
      });
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error.message);
      // Continue with other sources if one fails
    }
  }

  // Sort by date and remove duplicates
  return news
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .filter((item, index, self) => 
      index === self.findIndex(t => t.title === item.title)
    )
    .slice(0, 15); // Return top 15 most recent unique news
}

function parseDate(dateStr: string): number {
  if (dateStr.includes('h ago')) {
    const hours = parseInt(dateStr);
    return Date.now() - (hours * 60 * 60 * 1000);
  }
  if (dateStr.includes('d ago')) {
    const days = parseInt(dateStr);
    return Date.now() - (days * 24 * 60 * 60 * 1000);
  }
  return new Date(dateStr).getTime();
}

// Improve company name extraction with fuzzy matching
function extractCompanyName(title: string): string {
  const companies = db.prepare(`
    SELECT name, aliases 
    FROM companies 
    WHERE country = "DE" 
    AND (is_active = 1 OR is_active IS NULL)
  `).all();
  
  for (const company of companies) {
    // Check exact company name
    if (title.toLowerCase().includes(company.name.toLowerCase())) {
      return company.name;
    }
    
    // Check aliases if available
    if (company.aliases) {
      const aliases = JSON.parse(company.aliases);
      for (const alias of aliases) {
        if (title.toLowerCase().includes(alias.toLowerCase())) {
          return company.name;
        }
      }
    }
  }
  
  return '';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) {
    return `${hours}h ago`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

router.get('/german-companies', async (req, res) => {
  try {
    // Check cache
    if (Date.now() - lastFetch < CACHE_TTL) {
      return res.json(newsCache);
    }

    // Fetch fresh news
    const news = await scrapeNews();
    
    // Update cache
    newsCache = news;
    lastFetch = Date.now();

    // Store in database for analytics
    const stmt = db.prepare(`
      INSERT INTO news_articles (title, company, url, source, fetch_date)
      VALUES (?, ?, ?, ?, ?)
    `);

    news.forEach(item => {
      stmt.run(item.title, item.company, item.url, item.source, new Date().toISOString());
    });

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router; 