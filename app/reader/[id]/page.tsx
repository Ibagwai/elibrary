'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import PDFViewer from '@/components/shared/PDFViewer';
import { apiClient } from '@/lib/api/client';

export default function ReaderPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch content
    apiClient(`/api/v1/content/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setContent(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Track reading progress - record in history
    const token = localStorage.getItem('token');
    if (token) {
      apiClient(`/api/v1/reading-progress/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          current_page: 1,
          total_pages: 1,
          progress_percent: 0,
        }),
      }).catch(err => console.error('Failed to track reading:', err));
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!content) {
    notFound();
  }

  // Construct the full URL for the PDF file
  const pdfUrl = content.file_path 
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${content.file_path}`
    : null;

  // Check if download is allowed
  const allowDownload = content.allow_download ?? true;
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <a href="/browse" className="text-blue-600 hover:underline">← Back to Library</a>
          <h1 className="text-3xl font-bold mt-2">{content.title}</h1>
          <p className="text-gray-600">{content.ebook?.author || content.journal?.journal_name || 'Unknown Author'}</p>
        </div>

        {pdfUrl ? (
          <>
            {!allowDownload && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ This content is view-only. Download is not permitted.
                </p>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                src={allowDownload ? pdfUrl : `${pdfUrl}#toolbar=0`}
                className="w-full h-screen border-0"
                title="PDF Viewer"
              />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold mb-2">PDF File Not Available</h2>
            <p className="text-gray-600 mb-4">The PDF file for this content has not been uploaded yet.</p>
            <a href={`/content/${content.id}`} className="text-blue-600 hover:underline">← Back to Content Details</a>
          </div>
        )}
      </div>
    </div>
  );
}
