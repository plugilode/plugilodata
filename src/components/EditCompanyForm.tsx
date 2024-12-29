import React, { useState, useEffect } from 'react';
import { updateRecord } from '../utils/recordManager';
import { CompanyRecord } from '../types';

interface EditCompanyFormProps {
  record: CompanyRecord;
  onClose: () => void;
  onSave: (updatedRecord: CompanyRecord) => void;
}

export const EditCompanyForm: React.FC<EditCompanyFormProps> = ({ record, onClose, onSave }) => {
  const [formData, setFormData] = useState<CompanyRecord>(record);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(record);
  }, [record]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CompanyRecord) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const success = await updateRecord(formData.id, formData);
      if (success) {
        onSave(formData);
      } else {
        setError('Failed to update company');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 border border-green-500/30 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl text-green-500 mb-4">Edit Company</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-2">
            <h3 className="text-green-500">Basic Information</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Company Name"
              className="w-full bg-black/50 border border-green-500/30 rounded p-2 text-green-500"
            />
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              placeholder="Domain"
              className="w-full bg-black/50 border border-green-500/30 rounded p-2 text-green-500"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="text-green-500">Contact Information</h3>
            <input
              type="text"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full bg-black/50 border border-green-500/30 rounded p-2 text-green-500"
            />
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full bg-black/50 border border-green-500/30 rounded p-2 text-green-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-green-500">Description</h3>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Company Description"
              className="w-full bg-black/50 border border-green-500/30 rounded p-2 text-green-500 min-h-[100px]"
            />
          </div>

          {/* Categories and Tags */}
          <div className="space-y-2">
            <h3 className="text-green-500">Categories and Tags</h3>
            <input
              type="text"
              value={formData.category.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'category')}
              placeholder="Categories (comma-separated)"
              className="w-full bg-black/50 border border-green-500/30 rounded p-2 text-green-500"
            />
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'tags')}
              placeholder="Tags (comma-separated)"
              className="w-full bg-black/50 border border-green-500/30 rounded p-2 text-green-500"
            />
          </div>

          {error && (
            <div className="text-red-500 bg-red-500/10 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black/50 border border-green-500/30 rounded text-green-500 hover:bg-green-500/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded text-green-500 hover:bg-green-500/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
