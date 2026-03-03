'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

export default function EditContentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'ebook',
    title: '',
    description: '',
    abstract: '',
    language: 'en',
    published_year: new Date().getFullYear(),
    access_level: 'public',
    allow_download: true,
    department: '',
    status: 'draft',
    // Ebook fields
    author: '',
    isbn: '',
    publisher: '',
    pages: '',
    edition: '',
    // Journal fields
    journal_name: '',
    volume: '',
    issue: '',
    doi: '',
    // Student Project fields
    student_name: '',
    supervisor_name: '',
    degree_level: '',
    project_department: '',
    // Lecture fields
    instructor_name: '',
    course_code: '',
    course_name: '',
    duration_minutes: '',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiClient(`/api/v1/content/${params.id}`);
        const data = await res.json();
        if (data.data) {
          const content = data.data;
          setFormData({
            type: content.type,
            title: content.title,
            description: content.description || '',
            abstract: content.abstract || '',
            language: content.language || 'en',
            published_year: content.published_year || new Date().getFullYear(),
            access_level: content.access_level,
            allow_download: content.allow_download ?? true,
            department: content.department || '',
            status: content.status,
            // Ebook
            author: content.ebook?.author || '',
            isbn: content.ebook?.isbn || '',
            publisher: content.ebook?.publisher || '',
            pages: content.ebook?.pages || '',
            edition: content.ebook?.edition || '',
            // Journal
            journal_name: content.journal?.journal_name || '',
            volume: content.journal?.volume || '',
            issue: content.journal?.issue || '',
            doi: content.journal?.doi || '',
            // Student Project
            student_name: content.student_project?.student_name || '',
            supervisor_name: content.student_project?.supervisor_name || '',
            degree_level: content.student_project?.degree_level || '',
            project_department: content.student_project?.department || '',
            // Lecture
            instructor_name: content.lecture?.instructor_name || '',
            course_code: content.lecture?.course_code || '',
            course_name: content.lecture?.course_name || '',
            duration_minutes: content.lecture?.duration_seconds ? Math.floor(content.lecture.duration_seconds / 60) : '',
          });
          setExistingThumbnail(content.thumbnail_path);
        }
      } catch (error) {
        alert('Error fetching content');
      } finally {
        setFetching(false);
      }
    };
    fetchContent();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('_method', 'PUT');
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });
      
      if (file) {
        data.append('file', file);
      }

      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      const res = await apiClient(`/api/v1/admin/content/${params.id}`, {
        method: 'POST',
        headers: {
          // Remove Content-Type to let browser set it with boundary for FormData
        },
        body: data,
      });

      if (res.ok) {
        alert('Content updated successfully!');
        router.push('/admin/content');
      } else {
        const error = await res.json();
        alert('Failed to update content: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error updating content');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline mb-4"
          >
            ← Back to Content
          </button>
          <h1 className="text-3xl font-bold">Edit Content</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
            />
          </div>

          {/* Abstract */}
          <div>
            <label className="block text-sm font-medium mb-2">Abstract</label>
            <textarea
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          {/* Type-Specific Fields - Same as create page */}
          {formData.type === 'ebook' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Ebook Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Author *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Edition</label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.type === 'journal' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Journal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Journal Name *</label>
                  <input
                    type="text"
                    value={formData.journal_name}
                    onChange={(e) => setFormData({ ...formData, journal_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Volume</label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Issue</label>
                  <input
                    type="text"
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">DOI</label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.type === 'student_project' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Student Project Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Student Name *</label>
                  <input
                    type="text"
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Supervisor</label>
                  <input
                    type="text"
                    value={formData.supervisor_name}
                    onChange={(e) => setFormData({ ...formData, supervisor_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Degree Level</label>
                  <select
                    value={formData.degree_level}
                    onChange={(e) => setFormData({ ...formData, degree_level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select level</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="masters">Masters</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.project_department}
                    onChange={(e) => setFormData({ ...formData, project_department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.type === 'lecture' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Lecture Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Instructor Name *</label>
                  <input
                    type="text"
                    value={formData.instructor_name}
                    onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course Code</label>
                  <input
                    type="text"
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course Name</label>
                  <input
                    type="text"
                    value={formData.course_name}
                    onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="under_review">Under Review</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Download Permission */}
          <div>
            <label className="block text-sm font-medium mb-2">Download Permission</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allow_download}
                  onChange={(e) => setFormData({ ...formData, allow_download: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Allow users to download this file</span>
              </label>
            </div>
          </div>

          {/* Replace File */}
          <div>
            <label className="block text-sm font-medium mb-2">Replace PDF File</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                New file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Replace Cover Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Replace Cover Image</label>
            
            {/* Show existing thumbnail */}
            {existingThumbnail && !thumbnail && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Current cover:</p>
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${existingThumbnail}`}
                  alt="Current cover" 
                  className="w-32 h-48 object-cover rounded border"
                />
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {thumbnail && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">New cover preview:</p>
                <img 
                  src={URL.createObjectURL(thumbnail)} 
                  alt="Cover preview" 
                  className="w-32 h-48 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : '✅ Update Content'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
