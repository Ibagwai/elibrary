'use client';

import { useState, useEffect } from 'react';
import { generateBookCover } from '@/lib/utils'
import { useToast } from '@/lib/toast'
import { apiClient } from '@/lib/api/client'

export default function ContentDetailPage({ params }: { params: { id: string } }) {
  const { showToast } = useToast();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchContent();
    checkAuth();
  }, [params.id]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const fetchContent = async () => {
    try {
      const res = await apiClient(`/api/v1/content/${params.id}`);
      const data = await res.json();
      setContent(data.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please login to bookmark content', 'error');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    setBookmarkLoading(true);
    try {
      const res = await apiClient('/api/v1/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ content_item_id: params.id }),
      });

      if (res.ok) {
        setBookmarked(true);
        showToast('✓ Bookmarked successfully!', 'success');
      } else {
        showToast('Failed to bookmark', 'error');
      }
    } catch (error) {
      showToast('Error bookmarking content', 'error');
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center">Content not found</div>;
  }

  const gradient = generateBookCover(content.title, content.ebook?.author || '', content.type)
  const author = content.ebook?.author || content.journal?.journal_name || content.student_project?.student_name || content.lecture?.instructor_name
  const hasCover = !!content.thumbnail_path

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fadeIn">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            {hasCover ? (
              <div className="rounded-lg shadow-2xl overflow-hidden sticky top-8 relative">
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${content.thumbnail_path}`}
                  alt={content.title}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-xs uppercase tracking-wider opacity-80 mb-2">{content.type}</div>
                  <h1 className="text-xl font-bold leading-tight">{content.title}</h1>
                  {author && <div className="text-sm opacity-90 mt-2">{author}</div>}
                  {content.published_year && <div className="text-xs opacity-75 mt-1">{content.published_year}</div>}
                </div>
              </div>
            ) : (
              <div className={`bg-gradient-to-br ${gradient} rounded-lg shadow-2xl aspect-[3/4] p-8 flex flex-col justify-between text-white sticky top-8`}>
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-80 mb-4">{content.type}</div>
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">{content.title}</h1>
                </div>
                <div>
                  {author && <div className="text-lg opacity-90">{author}</div>}
                  {content.published_year && <div className="text-sm opacity-75 mt-2">{content.published_year}</div>}
                </div>
              </div>
            )}
          </div>

          {/* Content Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{content.type}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{content.language}</span>
                {content.access_level !== 'public' && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-1">
                    🔒 {content.access_level.replace('_', ' ')}
                  </span>
                )}
              </div>

              {/* Access Restriction Notice */}
              {content.access_level !== 'public' && !isLoggedIn && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">Restricted Access</h3>
                      <p className="text-sm text-amber-800 mb-2">
                        This content requires <strong>{content.access_level.replace('_', ' ')}</strong> access.
                      </p>
                      <a href="/login" className="text-sm text-blue-600 hover:underline font-medium">
                        Login to access →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                <span>👁 {content.view_count} views</span>
                <span>📥 {content.download_count} downloads</span>
              </div>
              
              {content.abstract && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Abstract</h2>
                  <p className="text-gray-700 leading-relaxed">{content.abstract}</p>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{content.description}</p>
              </div>
              
              {content.ebook && (
                <div className="border-t pt-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Ebook Details</h2>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium text-gray-600">Author</dt>
                      <dd className="text-gray-900">{content.ebook.author}</dd>
                    </div>
                    {content.ebook.isbn && (
                      <div>
                        <dt className="font-medium text-gray-600">ISBN</dt>
                        <dd className="text-gray-900">{content.ebook.isbn}</dd>
                      </div>
                    )}
                    {content.ebook.publisher && (
                      <div>
                        <dt className="font-medium text-gray-600">Publisher</dt>
                        <dd className="text-gray-900">{content.ebook.publisher}</dd>
                      </div>
                    )}
                    {content.ebook.pages && (
                      <div>
                        <dt className="font-medium text-gray-600">Pages</dt>
                        <dd className="text-gray-900">{content.ebook.pages}</dd>
                      </div>
                    )}
                    {content.ebook.edition && (
                      <div>
                        <dt className="font-medium text-gray-600">Edition</dt>
                        <dd className="text-gray-900">{content.ebook.edition}</dd>
                      </div>
                    )}
                    {content.ebook.file_format && (
                      <div>
                        <dt className="font-medium text-gray-600">Format</dt>
                        <dd className="text-gray-900 uppercase">{content.ebook.file_format}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
              
              {content.journal && (
                <div className="border-t pt-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Journal Details</h2>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium text-gray-600">Journal Name</dt>
                      <dd className="text-gray-900">{content.journal.journal_name}</dd>
                    </div>
                    {content.journal.volume && (
                      <div>
                        <dt className="font-medium text-gray-600">Volume/Issue</dt>
                        <dd className="text-gray-900">{content.journal.volume}/{content.journal.issue}</dd>
                      </div>
                    )}
                    {content.journal.doi && (
                      <div className="md:col-span-2">
                        <dt className="font-medium text-gray-600">DOI</dt>
                        <dd className="text-gray-900 break-all">{content.journal.doi}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {content.student_project && (
                <div className="border-t pt-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium text-gray-600">Student</dt>
                      <dd className="text-gray-900">{content.student_project.student_name}</dd>
                    </div>
                    {content.student_project.supervisor_name && (
                      <div>
                        <dt className="font-medium text-gray-600">Supervisor</dt>
                        <dd className="text-gray-900">{content.student_project.supervisor_name}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium text-gray-600">Degree Level</dt>
                      <dd className="text-gray-900 capitalize">{content.student_project.degree_level}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-600">Department</dt>
                      <dd className="text-gray-900">{content.student_project.department}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {content.lecture && (
                <div className="border-t pt-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Lecture Details</h2>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium text-gray-600">Instructor</dt>
                      <dd className="text-gray-900">{content.lecture.instructor_name}</dd>
                    </div>
                    {content.lecture.course_code && (
                      <div>
                        <dt className="font-medium text-gray-600">Course Code</dt>
                        <dd className="text-gray-900">{content.lecture.course_code}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium text-gray-600">Course Name</dt>
                      <dd className="text-gray-900">{content.lecture.course_name}</dd>
                    </div>
                    {content.lecture.duration_seconds && (
                      <div>
                        <dt className="font-medium text-gray-600">Duration</dt>
                        <dd className="text-gray-900">{Math.floor(content.lecture.duration_seconds / 60)} minutes</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 pt-6 border-t">
                {content.allow_download ? (
                  <a 
                    href={content.file_path ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${content.file_path}` : '#'} 
                    download 
                    className="flex-1 md:flex-none px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  >
                    📥 Download
                  </a>
                ) : (
                  <button 
                    disabled
                    className="flex-1 md:flex-none px-8 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium text-center"
                    title="Download not allowed for this content"
                  >
                    🔒 Download Disabled
                  </button>
                )}
                <a href={`/reader/${content.id}`} className="flex-1 md:flex-none px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
                  📖 Read Online
                </a>
                <button 
                  onClick={handleBookmark}
                  disabled={bookmarkLoading || bookmarked}
                  className={`px-8 py-3 border-2 rounded-lg font-medium transition-colors ${
                    bookmarked 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  } disabled:opacity-50`}
                >
                  {bookmarked ? '✓ Bookmarked' : '🔖 Bookmark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
