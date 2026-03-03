'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { generateBookCover } from '@/lib/utils'
import { apiClient } from '@/lib/api/client'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any[]>([])
  const [topSearches, setTopSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    fetchTopSearches()
    if (searchParams.get('q')) {
      handleSearch()
    }
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    const timer = setTimeout(() => {
      setLoading(true)
      setSearched(true)
      apiClient(`/api/v1/content?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data.data?.data || []))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const fetchTopSearches = async () => {
    // Mock top searches - replace with API call if available
    setTopSearches([
      'Machine Learning',
      'Data Science',
      'Web Development',
      'Artificial Intelligence',
      'Database Systems',
      'Software Engineering',
    ])
  }

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    setSearched(true)
    try {
      const res = await apiClient(`/api/v1/content?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.data?.data || [])
    } catch (err) {
      console.error('Search failed', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const quickSearch = (term: string) => {
    setQuery(term)
    setSearched(true)
    setLoading(true)
    apiClient(`/api/v1/content?search=${encodeURIComponent(term)}`)
      .then(res => res.json())
      .then(data => setResults(data.data?.data || []))
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Search Header */}
        <div className="text-center mb-8 animate-slideUp">
          <h1 className="text-4xl font-bold mb-4">Search Library</h1>
          <p className="text-gray-600">Find ebooks, journals, projects, and lectures</p>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8 animate-scaleIn">
          <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for content..."
              className="flex-1 px-6 py-4 text-lg outline-none"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '🔄 Searching...' : '🔍 Search'}
            </button>
          </div>
        </form>

        {/* Top Searches */}
        {!searched && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">🔥 Top Searches</h2>
            <div className="flex flex-wrap gap-3">
              {topSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => quickSearch(term)}
                  className="px-4 py-2 bg-white rounded-full shadow hover:shadow-md hover:bg-blue-50 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Results */}
        {searched && (
          <div>
            {loading ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔄</div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-gray-600 mb-6 font-medium">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
                <div className="space-y-4">
                  {results.map((item: any, index: number) => {
                    const gradient = generateBookCover(item.title, '', item.type)
                    const hasCover = !!item.thumbnail_path
                    return (
                      <a 
                        key={item.id} 
                        href={`/content/${item.id}`}
                        className="block animate-slideUp"
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all p-6 flex gap-6">
                          {hasCover ? (
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.thumbnail_path}`}
                              alt={item.title}
                              className="w-24 h-32 object-cover rounded flex-shrink-0"
                            />
                          ) : (
                            <div className={`w-24 h-32 bg-gradient-to-br ${gradient} rounded flex-shrink-0 flex items-end p-3`}>
                              <div className="text-white text-xs uppercase font-semibold bg-black/20 px-2 py-1 rounded">
                                {item.type.replace('_', ' ')}
                              </div>
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                                {item.view_count} views
                              </span>
                              <span className="text-blue-600 font-medium">View Details →</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600">Try different keywords or browse our collection</p>
                <a href="/browse" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse All Content
                </a>
              </div>
            )}
          </div>
        )}

        {/* Empty State with Popular Topics */}
        {!searched && (
          <div className="text-center py-16 bg-white rounded-lg shadow animate-fadeIn">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
            <p className="text-gray-600 mb-6">Enter keywords to find ebooks, journals, and more</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200" onClick={() => quickSearch('Programming')}>Programming</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200" onClick={() => quickSearch('Mathematics')}>Mathematics</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200" onClick={() => quickSearch('Physics')}>Physics</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200" onClick={() => quickSearch('Chemistry')}>Chemistry</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
