import React, { useState } from 'react';
import { Record } from '../types';
import { EditCompanyForm } from './EditCompanyForm';

interface SearchResultsProps {
  results: Record[];
  isSearching: boolean;
  onLogout: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isSearching }) => {
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

  const handleRecordClick = (record: Record) => {
    setSelectedRecord(record);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((record, index) => (
          <div
            key={record.id || index}
            onClick={() => handleRecordClick(record)}
            className="bg-black/30 border border-green-500/30 rounded-lg p-4 cursor-pointer hover:bg-green-500/10 transition-colors"
          >
            <h3 className="text-green-500 font-bold mb-2">{record.name}</h3>
            <p className="text-green-500/70 text-sm mb-2">{record.description}</p>
            {record.domain && (
              <p className="text-green-500/50 text-xs">{record.domain}</p>
            )}
          </div>
        ))}
      </div>

      {selectedRecord && (
        <EditCompanyForm
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSave={(updatedRecord) => {
            // Handle save logic here
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
};
