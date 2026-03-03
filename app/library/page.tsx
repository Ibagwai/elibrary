'use client'

import { useEffect, useState } from 'react'
import { generateBookCover } from '@/lib/utils'
import { apiClient } from '@/lib/api/client'

export default function LibraryPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('bookmarks')
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = '/login'
      return
    }
    
    // Fetch bookmarks
    apiClient('/api/v1/bookmarks')
    .then(res => res.json())
    .then(data => {
      setBookmarks(data.data || [])
      setLoading(false)
    })
    .catch(() => setLoading(false))

    // Fetch history
    apiClient('/api/v1/history')
    .then(res => res.json())
    .then(data => {
      setHistory(data.data?.data || [])
    })
    .catch(() => {})
  }, [])

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Library</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🔖 Bookmarks
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🕐 History
              </button>
              <button
                onClick={() => setActiveTab('downloads')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'downloads'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📥 Downloads
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'bookmarks' && (
              <div>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : bookmarks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No bookmarks yet</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((item) => {
                      const gradient = generateBookCover(item.title, item.author || '', item.type)
                      return (
                        <a key={item.id} href={`/content/${item.slug}`} className="group">
                          <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all">
                            <div className={`bg-gradient-to-br ${gradient} aspect-[3/4] p-4 flex flex-col justify-between text-white`}>
                              <div className="text-xs uppercase tracking-wider opacity-80 bg-white/20 rounded px-2 py-1 inline-block w-fit">
                                {item.type}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg leading-tight mb-2">{item.title}</h3>
                                <div className="text-sm opacity-90">{item.author}</div>
                              </div>
                            </div>
                            <div className="p-4">
                              <button className="text-red-600 text-sm hover:underline">Remove Bookmark</button>
                            </div>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No reading history yet</div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-500 capitalize mb-1">{item.type?.replace('_', ' ')}</div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <div className="text-sm text-gray-600">{item.author || 'Unknown'}</div>
                        </div>
                        <div className="text-sm text-gray-500">{new Date(item.last_read_at).toLocaleDateString()}</div>
                        <a href={`/content/${item.slug}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📥</div>
                <p>No downloads yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
