import React, { useState } from 'react';
import { 
  Newspaper, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  RefreshCcw, 
  Bookmark, 
  Share2, 
  Filter,
  Image
} from 'lucide-react';
import { useNewsData } from '../hooks/useNewsData';
import { Toast } from './Toast';

const CATEGORIES = [
  'All',
  'Markets',
  'Companies',
  'Economy',
  'Technology',
  'Finance'
] as const;

type Category = typeof CATEGORIES[number];

export const NewsWidget = () => {
  const { news, loading, error, refreshNews } = useNewsData();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [bookmarkedNews, setBookmarkedNews] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('bookmarked_news') || '[]'))
  );
  const [showCategories, setShowCategories] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleRefresh = async () => {
    await refreshNews();
  };

  const toggleBookmark = (newsId: string) => {
    const newBookmarks = new Set(bookmarkedNews);
    if (newBookmarks.has(newsId)) {
      newBookmarks.delete(newsId);
      setToast({ message: 'Removed from bookmarks', type: 'success' });
    } else {
      newBookmarks.add(newsId);
      setToast({ message: 'Added to bookmarks', type: 'success' });
    }
    setBookmarkedNews(newBookmarks);
    localStorage.setItem('bookmarked_news', JSON.stringify([...newBookmarks]));
  };

  const shareNews = async (news: { title: string; url: string }) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          url: news.url
        });
        setToast({ message: 'News shared successfully', type: 'success' });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setToast({ message: 'Failed to share news', type: 'error' });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(news.url);
        setToast({ message: 'Link copied to clipboard', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to copy link', type: 'error' });
      }
    }
  };

  const filteredNews = news.filter(item => 
    selectedCategory === 'All' || item.company.includes(selectedCategory)
  );

  return (
    <div className="bg-black/30 border border-green-500/30 rounded-lg p-4 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-green-500" />
          <h2 className="text-green-500 font-mono text-sm">THE GUARDIAN BUSINESS NEWS</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="text-green-500/50 hover:text-green-500 transition-colors"
            title="Filter categories"
          >
            <Filter className="w-3 h-3" />
          </button>
          <button
            onClick={handleRefresh}
            className="text-green-500/50 hover:text-green-500 transition-colors"
            disabled={loading}
            title="Refresh news"
          >
            <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-green-500/50 text-xs">Live Feed</span>
        </div>
      </div>

      {showCategories && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-green-500/20 text-green-500'
                  : 'text-green-500/50 hover:text-green-500 hover:bg-green-500/10'
              } transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-green-500/50 text-sm gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : loading && filteredNews.length === 0 ? (
          <div className="flex items-center justify-center h-full text-green-500/50 text-sm">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading news...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="flex items-center justify-center h-full text-green-500/50 text-sm">
            No news available
          </div>
        ) : (
          filteredNews.map((item, index) => (
            <div key={index} className="group">
              <div className="block hover:bg-green-500/5 rounded-lg p-2 transition-colors">
                <div className="flex gap-3">
                  {item.thumbnail && (
                    <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden border border-green-500/20">
                      <img 
                        src={item.thumbnail} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-green-500 text-sm mb-1 line-clamp-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-green-500/50 text-xs line-clamp-2 mb-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-green-500/70">{item.company}</span>
                        <span className="text-green-500/30">•</span>
                        <span className="text-green-500/50">{item.date}</span>
                      </div>
                    </a>
                  </div>
                  <div className="flex flex-col items-center gap-2 ml-2">
                    <button
                      onClick={() => toggleBookmark(item.url)}
                      className="opacity-0 group-hover:opacity-100 text-green-500/30 hover:text-green-500 transition-all"
                      title="Bookmark"
                    >
                      <Bookmark 
                        className="w-4 h-4" 
                        fill={bookmarkedNews.has(item.url) ? 'currentColor' : 'none'} 
                      />
                    </button>
                    <button
                      onClick={() => shareNews(item)}
                      className="opacity-0 group-hover:opacity-100 text-green-500/30 hover:text-green-500 transition-all"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500/30 group-hover:text-green-500/70 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}; 