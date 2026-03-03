'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api/client'
import Link from 'next/link'
import BulkUploadDropzone from '@/components/admin/BulkUploadDropzone'

export default function AdminContentPage() {
  const router = useRouter()
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    apiClient('/api/v1/admin/content')
      .then(res => res.json())
      .then(data => {
        setContent(data.data?.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handlePublish = async (id: number) => {
    try {
      await apiClient(`/api/v1/admin/content/${id}/publish`, {
        method: 'POST',
      })
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      await apiClient(`/api/v1/admin/content/${id}`, {
        method: 'DELETE',
      })
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Content</h1>
            <p className="text-gray-600">View and manage all library content</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              📦 Bulk Upload
            </button>
            <Link
              href="/admin/content/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              + Add New Content
            </Link>
          </div>
        </div>

        {showBulkUpload && (
          <div className="mb-8">
            <BulkUploadDropzone />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
          <select className="px-4 py-2 border rounded-lg">
            <option>All Types</option>
            <option>Ebooks</option>
            <option>Journals</option>
            <option>Projects</option>
            <option>Lectures</option>
          </select>
          <select className="px-4 py-2 border rounded-lg">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Under Review</option>
          </select>
          <input
            type="search"
            placeholder="Search content..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : content.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No content found</td>
                </tr>
              ) : (
                content.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">by {item.uploader?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                        {item.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-800' :
                        item.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.view_count}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {item.status !== 'published' && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/admin/content/edit/${item.id}`)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
