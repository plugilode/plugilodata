import React from 'react';
import { Mail, X } from 'lucide-react';
import { useRecord } from '../hooks/useRecord';

interface RecordViewerProps {
  recordId: string;
  onClose?: () => void;
}

export const RecordViewer: React.FC<RecordViewerProps> = ({ recordId, onClose }) => {
  const { data: record, isLoading, error } = useRecord(recordId);

  if (isLoading) {
    return <div className="text-green-500">Loading...</div>;
  }

  if (error || !record) {
    return <div className="text-red-500">Error loading record</div>;
  }

  return (
    <div className="bg-black/90 border border-green-500/30 rounded-lg p-8 text-green-500 relative">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-green-500 hover:text-green-400"
      >
        <X size={24} />
      </button>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        {record.logo && (
          <img src={record.logo} alt="Company Logo" className="w-24 h-24 object-contain" />
        )}
        <div className="flex-grow">
          <h1 className="text-2xl font-mono mb-1">{record.url}</h1>
          <div className="text-green-500/70 font-mono">{record.domain}</div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-green-500/30 rounded hover:bg-green-500/10">
            <Mail size={16} />
            Request Review
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-green-500/30 rounded hover:bg-green-500/10">
            AI Research Agent
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-green-500/30 rounded hover:bg-green-500/10">
            Confirm
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <section className="mb-8">
        <h2 className="text-lg font-mono mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono">
          <div>Name: <span className="text-green-500/70">{record.name}</span></div>
          <div>Domain: <span className="text-green-500/70">{record.domain}</span></div>
          <div>Url: <span className="text-green-500/70">{record.url}</span></div>
        </div>
      </section>

      {/* Location Information */}
      <section className="mb-8">
        <h2 className="text-lg font-mono mb-4">Location Information</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono">
          <div>Country: <span className="text-green-500/70">{record.basicInformation.country}</span></div>
          <div>Lat: <span className="text-green-500/70">{record.basicInformation.lat}</span></div>
          <div>Lng: <span className="text-green-500/70">{record.basicInformation.lng}</span></div>
          <div>Time Zone: <span className="text-green-500/70">{record.basicInformation.timeZone}</span></div>
        </div>
      </section>

      {/* Company Information */}
      <section className="mb-8">
        <h2 className="text-lg font-mono mb-4">Company Information</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono">
          <div className="col-span-2 mb-2">
            Description: <span className="text-green-500/70">{record.companyInformation.description}</span>
          </div>
          <div>Category: <span className="text-green-500/70">{record.companyInformation.category}</span></div>
          <div>Industry Group: <span className="text-green-500/70">{record.companyInformation.industryGroup}</span></div>
          <div>Gics Code: <span className="text-green-500/70">{record.companyInformation.gicsCode}</span></div>
          <div>Naics6 Codes2022: <span className="text-green-500/70">{record.companyInformation.naics6Codes2022}</span></div>
          <div>Naics6 Codes: <span className="text-green-500/70">{record.companyInformation.naics6Codes}</span></div>
          <div>Sector: <span className="text-green-500/70">{record.companyInformation.sector}</span></div>
          <div>Naics Code: <span className="text-green-500/70">{record.companyInformation.naicsCode}</span></div>
          <div>Sic Code: <span className="text-green-500/70">{record.companyInformation.sicCode}</span></div>
          <div>Sic4 Codes: <span className="text-green-500/70">{record.companyInformation.sic4Codes}</span></div>
          <div>Tags: <span className="text-green-500/70">{record.companyInformation.tags.join(', ')}</span></div>
          <div>Tag_trustedshops: <span className="text-green-500/70">{record.companyInformation.tagTrustedshops}</span></div>
          <div>Type: <span className="text-green-500/70">{record.companyInformation.type}</span></div>
        </div>
      </section>

      {/* Details Information */}
      <section>
        <h2 className="text-lg font-mono mb-4">Details Information</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono">
          <div>Alexa Global Rank: <span className="text-green-500/70">{record.detailsInformation.alexaGlobalRank}</span></div>
          <div>Email: <span className="text-green-500/70">{record.detailsInformation.email}</span></div>
          <div>Tech: <span className="text-green-500/70">{record.detailsInformation.tech.join(', ')}</span></div>
          <div>Tech Categories: <span className="text-green-500/70">{record.detailsInformation.techCategories.join(', ')}</span></div>
        </div>
      </section>
    </div>
  );
};

export default RecordViewer;
