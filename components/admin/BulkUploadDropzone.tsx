'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export default function BulkUploadDropzone() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient('/api/v1/admin/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Bulk Upload Content</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="bulk-upload"
        />
        <label htmlFor="bulk-upload" className="cursor-pointer">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-lg font-medium mb-2">
            {uploading ? 'Uploading...' : 'Drop ZIP file here or click to browse'}
          </p>
          <p className="text-sm text-gray-500">
            Upload a ZIP file containing PDF documents
          </p>
        </label>
      </div>

      {results && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Upload Results:</h3>
          <div className="space-y-2">
            <div className="p-3 bg-green-50 rounded">
              <p className="text-green-800 font-medium">
                ✅ Success: {results.success?.length || 0} files
              </p>
              {results.success?.map((item: any, idx: number) => (
                <p key={idx} className="text-sm text-green-700">• {item.file}</p>
              ))}
            </div>
            
            {results.failed?.length > 0 && (
              <div className="p-3 bg-red-50 rounded">
                <p className="text-red-800 font-medium">
                  ❌ Failed: {results.failed.length} files
                </p>
                {results.failed.map((item: any, idx: number) => (
                  <p key={idx} className="text-sm text-red-700">
                    • {item.file}: {item.error}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
