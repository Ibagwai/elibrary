'use client';

interface PDFViewerProps {
  url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  return (
    <div className="w-full h-screen">
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  );
}
