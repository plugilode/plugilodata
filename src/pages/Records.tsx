import React, { useState, useCallback } from 'react';
import { useRecords } from '../hooks/useRecords';
import { RecordList } from '../components/RecordList';
import { RecordViewer } from '../components/RecordViewer';

export const Records = () => {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    country: '',
  });

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading 
  } = useRecords({
    ...filters,
    pageSize: 20
  });

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  // Intersection Observer callback for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex h-screen">
      {/* Filters Panel */}
      <div className="w-64 bg-black/90 border-r border-green-500/30 p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-black/30 border border-green-500/30 rounded px-4 py-2 text-green-500"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Records List */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-green-500">Loading...</span>
          </div>
        ) : (
          <>
            <RecordList
              records={data?.pages.flatMap(page => page.records) || []}
              onRecordClick={(id) => setSelectedRecord(id)}
            />
            <div
              ref={(el) => {
                if (el) {
                  const observer = new IntersectionObserver(handleObserver, {
                    threshold: 0.5,
                  });
                  observer.observe(el);
                }
              }}
              className="h-10"
            />
          </>
        )}
      </div>

      {/* Record Viewer Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <RecordViewer
            recordId={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        </div>
      )}
    </div>
  );
}; 