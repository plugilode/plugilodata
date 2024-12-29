import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LazyLoad } from './LazyLoad';

interface RecordListProps {
  records: Record[];
  onRecordClick: (id: string) => void;
}

export const RecordList = ({ records, onRecordClick }: RecordListProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: records.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5, // Number of items to render outside the visible area
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const record = records[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <LazyLoad>
                <div
                  onClick={() => onRecordClick(record.id)}
                  className="cursor-pointer hover:bg-green-500/10 p-4 border-b border-green-500/30"
                >
                  <h3 className="text-green-500">{record.name}</h3>
                  <div className="text-green-500/70">{record.domain}</div>
                </div>
              </LazyLoad>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 