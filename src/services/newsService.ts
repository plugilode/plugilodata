import axios from 'axios';

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const GNEWS_API_URL = 'https://gnews.io/api/v4/top-headlines';

export interface NewsItem {
  title: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  description: string;
}

// Mock data for development
const mockNews: NewsItem[] = [
  {
    title: "New Advances in Cloud Computing Technology",
    url: "#",
    publishedAt: new Date().toISOString(),
    source: { name: "Tech News" },
    description: "Latest developments in cloud computing infrastructure and services..."
  },
  {
    title: "Cybersecurity Trends for 2024",
    url: "#",
    publishedAt: new Date().toISOString(),
    source: { name: "Security Weekly" },
    description: "Analysis of emerging cybersecurity threats and solutions..."
  },
  {
    title: "AI Integration in Enterprise Software",
    url: "#",
    publishedAt: new Date().toISOString(),
    source: { name: "AI Today" },
    description: "How businesses are leveraging AI in their software solutions..."
  },
  {
    title: "The Future of Remote Work Technology",
    url: "#",
    publishedAt: new Date().toISOString(),
    source: { name: "Digital Workplace" },
    description: "Innovations in remote collaboration and virtual office solutions..."
  },
  {
    title: "5G Network Expansion Updates",
    url: "#",
    publishedAt: new Date().toISOString(),
    source: { name: "Telecom News" },
    description: "Latest developments in 5G infrastructure and deployment..."
  }
];

export const fetchLatestNews = async (): Promise<NewsItem[]> => {
  // If we're in development mode or don't have an API key, return mock data
  if (!GNEWS_API_KEY || import.meta.env.DEV) {
    console.log('Using mock news data');
    return mockNews;
  }

  try {
    const response = await axios.get(GNEWS_API_URL, {
      params: {
        token: GNEWS_API_KEY,
        topic: 'technology',
        lang: 'en',
        max: 5,
        sortby: 'publishedAt'
      }
    });

    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return mock data as fallback
    return mockNews;
  }
}; 