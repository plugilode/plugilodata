import { useState, useEffect } from 'react';
import { GuardianNewsItem, GuardianApiResponse } from '../types';

interface NewsItem {
  title: string;
  company: string;
  date: string;
  url: string;
  source: string;
  thumbnail?: string;
  description?: string;
}

const GUARDIAN_API_KEY = '764bb508-ace1-4ce3-8830-f557eee1704e';
const CACHE_KEY = 'guardian_news_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useNewsData = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCachedNews = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    return null;
  };

  const setCachedNews = (data: NewsItem[]) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  const transformGuardianNews = (items: GuardianNewsItem[]): NewsItem[] => {
    return items.map(item => {
      // Extract company name from title if possible
      const companyPattern = /([A-Z][a-zA-Z0-9]*(?:\s+[A-Z][a-zA-Z0-9]*)*(?:\s+(?:Inc|Corp|AG|SE|GmbH|Ltd|PLC)))/;
      const companyMatch = item.webTitle.match(companyPattern);
      const company = companyMatch ? companyMatch[0] : item.sectionName;

      // Format date
      const date = new Date(item.webPublicationDate);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      let formattedDate;
      if (diffMinutes < 60) {
        formattedDate = `${diffMinutes}m ago`;
      } else if (diffMinutes < 1440) {
        formattedDate = `${Math.floor(diffMinutes / 60)}h ago`;
      } else {
        formattedDate = `${Math.floor(diffMinutes / 1440)}d ago`;
      }

      return {
        title: item.fields?.headline || item.webTitle,
        company,
        date: formattedDate,
        url: item.webUrl,
        source: 'The Guardian',
        thumbnail: item.fields?.thumbnail,
        description: item.fields?.trailText
      };
    });
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://content.guardianapis.com/search?` +
        new URLSearchParams({
          'api-key': GUARDIAN_API_KEY,
          'section': 'business',
          'show-fields': 'headline,thumbnail,trailText,shortUrl',
          'page-size': '10',
          'order-by': 'newest',
          'q': 'business OR company OR market OR economy'
        })
      );

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data: GuardianApiResponse = await response.json();
      
      if (data.response.status === 'ok') {
        const transformedNews = transformGuardianNews(data.response.results);
        setNews(transformedNews);
        setCachedNews(transformedNews);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news. Please try again later.');
      
      // Use cached data as fallback
      const cached = getCachedNews();
      if (cached) {
        setNews(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    setLoading(true);
    await fetchNews();
  };

  useEffect(() => {
    const cached = getCachedNews();
    if (cached) {
      setNews(cached);
      setLoading(false);
    } else {
      fetchNews();
    }

    const interval = setInterval(fetchNews, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return { news, loading, error, refreshNews };
}; 