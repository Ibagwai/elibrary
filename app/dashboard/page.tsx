'use client'

import { useEffect, useState } from 'react'
import { fetchContent, apiClient } from '@/lib/api/client'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [recentContent, setRecentContent] = useState<any[]>([])
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [readingHistory, setReadingHistory] = useState<any[]>([])
  const [stats, setStats] = useState({
    bookmarks: 0,
    downloads: 0,
    reading: 0
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = '/login'
    }

    // Fetch recent content
    fetchContent({ per_page: 6 }).then(data => {
      setRecentContent(data.data?.data || [])
    })

    // Fetch user data
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch bookmarks
      apiClient('/api/v1/bookmarks')
      .then(res => res.json())
      .then(data => {
        const bookmarkData = data.data?.data || data.data || [];
        setBookmarks(bookmarkData);
        setStats(prev => ({ ...prev, bookmarks: bookmarkData.length }))
      })
      .catch(err => console.error('Bookmarks error:', err))

      // Fetch reading history
      apiClient('/api/v1/reading-progress')
      .then(res => res.json())
      .then(data => {
        const historyData = data.data?.data || data.data || [];
        setReadingHistory(historyData);
        setStats(prev => ({ ...prev, reading: historyData.length }))
      })
      .catch(err => console.error('Reading history error:', err))
    }
  }, [])

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8 animate-slideUp">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-blue-100">Role: <span className="font-semibold capitalize">{user.role}</span></p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🔖</div>
              <div className="text-2xl font-bold text-blue-600">{stats.bookmarks}</div>
            </div>
            <div className="text-gray-600 text-sm">Bookmarks</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 animate-scaleIn" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📖</div>
              <div className="text-2xl font-bold text-green-600">{stats.reading}</div>
            </div>
            <div className="text-gray-600 text-sm">Reading History</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {(bookmarks.length > 0 || readingHistory.length > 0) ? (
            <div className="space-y-3">
              {bookmarks.slice(0, 3).map((bookmark: any) => (
                <div key={bookmark.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl">🔖</div>
                  <div className="flex-1">
                    <a href={`/content/${bookmark.content_item_id}`} className="font-medium hover:text-blue-600">
                      {bookmark.content_item?.title || bookmark.title || `Content #${bookmark.content_item_id?.substring(0, 8)}`}
                    </a>
                    <p className="text-sm text-gray-500">
                      Bookmarked {bookmark.content_item?.type ? `• ${bookmark.content_item.type.replace('_', ' ')}` : ''} • {new Date(bookmark.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {readingHistory.slice(0, 3).map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl">📖</div>
                  <div className="flex-1">
                    <a href={`/content/${item.content_item_id}`} className="font-medium hover:text-blue-600">
                      {item.content_item?.title || item.title || `Content #${item.content_item_id?.substring(0, 8)}`}
                    </a>
                    <p className="text-sm text-gray-500">
                      {item.progress_percentage || 0}% complete • {new Date(item.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <p>No activity yet. Start exploring the library!</p>
            </div>
          )}
        </div>

        {/* Recommended Content */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <a href="/browse" className="text-blue-600 hover:underline">View All →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentContent.slice(0, 3).map((item: any) => (
              <a key={item.id} href={`/content/${item.slug}`} className="bg-white rounded-lg shadow hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-2 capitalize">{item.type.replace('_', ' ')}</div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
