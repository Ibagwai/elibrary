'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

export default function CreateContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    
    try {
      // Create FormData for file upload
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });
      
      if (file) {
        data.append('file', file);
      }

      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      const res = await apiClient('/api/v1/admin/content', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        alert('Content created successfully!');
        router.push('/admin/content');
      } else {
        const error = await res.json();
        alert('Failed to create content: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error creating content');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Add New Content</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Content Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="ebook">📚 Ebook</option>
              <option value="journal">📰 Journal</option>
              <option value="magazine">📖 Magazine</option>
              <option value="newspaper">🗞️ Newspaper</option>
              <option value="student_project">🎓 Student Project</option>
              <option value="lecture">🎬 Lecture</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter content title"
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
              placeholder="Enter description"
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
              placeholder="Enter abstract or summary"
            />
          </div>

          {/* Type-Specific Fields */}
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
                    placeholder="Author name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="978-0-123456-78-9"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Publisher name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Number of pages"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Edition</label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., 2nd Edition"
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
                    placeholder="Journal name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Volume</label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Volume number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Issue</label>
                  <input
                    type="text"
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Issue number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">DOI</label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="10.1234/example"
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
                    placeholder="Student name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Supervisor</label>
                  <input
                    type="text"
                    value={formData.supervisor_name}
                    onChange={(e) => setFormData({ ...formData, supervisor_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Supervisor name"
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
                    placeholder="Department"
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
                    placeholder="Instructor name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course Code</label>
                  <input
                    type="text"
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., CS101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course Name</label>
                  <input
                    type="text"
                    value={formData.course_name}
                    onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Course name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Duration in minutes"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Language & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Published Year</label>
              <input
                type="number"
                value={formData.published_year}
                onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Access Level */}
          <div>
            <label className="block text-sm font-medium mb-2">Access Level *</label>
            <select
              value={formData.access_level}
              onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="public">🌍 Public - Anyone can access</option>
              <option value="authenticated">🔐 Authenticated - Logged in users only</option>
              <option value="faculty_only">👨‍🏫 Faculty Only</option>
              <option value="admin_only">👑 Admin Only</option>
              <option value="department">🏢 Department Specific</option>
            </select>
          </div>

          {/* Department (conditional) */}
          {formData.access_level === 'department' && (
            <div>
              <label className="block text-sm font-medium mb-2">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="medicine">Medicine</option>
                <option value="science">Science</option>
                <option value="arts">Arts & Humanities</option>
                <option value="business">Business</option>
                <option value="law">Law</option>
                <option value="education">Education</option>
              </select>
            </div>
          )}

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
            <p className="text-xs text-gray-500 mt-1">
              {formData.type === 'journal' && '⚠️ Journals are typically view-only'}
              {formData.type === 'student_project' && '⚠️ Student projects are typically view-only'}
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload PDF File *</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Cover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {thumbnail && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">
                  Preview: {thumbnail.name}
                </p>
                <img 
                  src={URL.createObjectURL(thumbnail)} 
                  alt="Cover preview" 
                  className="w-32 h-48 object-cover rounded border"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 600x900px (2:3 ratio), JPG or PNG
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : '✅ Create Content'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Note: After creating, you can upload files in the content management page
          </p>
        </form>
      </div>
    </div>
  );
}
