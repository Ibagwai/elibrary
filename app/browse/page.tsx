'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateBookCover } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 20,
  });
  
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    language: searchParams.get('language') || '',
    year: searchParams.get('year') || '',
    search: searchParams.get('search') || '',
    page: searchParams.get('page') || '1',
  });

  useEffect(() => {
    fetchContent();
  }, [filters]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilter('search', searchInput);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  async function fetchContent() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.type) params.append('filter[type]', filters.type);
    if (filters.language) params.append('filter[language]', filters.language);
    if (filters.year) params.append('year', filters.year);
    if (filters.search) params.append('search', filters.search);
    params.append('page', filters.page);

    const res = await apiClient(`/api/v1/content?${params}`);
    const data = await res.json();
    setContent(data.data?.data || []);
    setPagination({
      current_page: data.data?.current_page || 1,
      last_page: data.data?.last_page || 1,
      total: data.data?.total || 0,
      per_page: data.data?.per_page || 20,
    });
    setLoading(false);
  }

  function updateFilter(key: string, value: string) {
    const newFilters = { ...filters, [key]: value, page: key === 'page' ? value : '1' };
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    router.push(`/browse?${params.toString()}`);
  }

  function clearFilters() {
    setSearchInput('');
    setFilters({ type: '', language: '', year: '', search: '', page: '1' });
    router.push('/browse');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-slideUp">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Content</h1>
          <p className="text-gray-600">Explore our collection of digital resources</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Types</option>
                <option value="ebook">📚 Ebooks</option>
                <option value="journal">📰 Journals</option>
                <option value="magazine">📖 Magazines</option>
                <option value="newspaper">🗞️ Newspapers</option>
                <option value="student_project">🎓 Student Projects</option>
                <option value="lecture">🎬 Lectures</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={filters.language}
                onChange={(e) => updateFilter('language', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Languages</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={filters.year}
                onChange={(e) => updateFilter('year', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Years</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {(filters.type || filters.language || filters.year || filters.search) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.type && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Type: {filters.type}
                </span>
              )}
              {filters.language && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Language: {filters.language}
                </span>
              )}
              {filters.year && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Year: {filters.year}
                </span>
              )}
              {filters.search && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  Search: {filters.search}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-red-600 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {loading ? 'Loading...' : `${content.length} items found`}
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {content.map((item: any, index: number) => {
            const gradient = generateBookCover(item.title, item.ebook?.author || '', item.type)
            const author = item.ebook?.author || item.journal?.journal_name || item.student_project?.student_name || item.lecture?.instructor_name
            const hasCover = !!item.thumbnail_path
            const isRestricted = item.access_level !== 'public'
            
            return (
              <a 
                key={item.id} 
                href={`/content/${item.id}`} 
                className="group animate-scaleIn"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden">
                  {hasCover ? (
                    <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.thumbnail_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        <div className="text-xs uppercase tracking-wider bg-black/60 text-white rounded px-2 py-1">
                          {item.type.replace('_', ' ')}
                        </div>
                        {isRestricted && (
                          <div className="text-xs bg-amber-500 text-white rounded px-2 py-1 flex items-center gap-1">
                            🔒 {item.access_level.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={`bg-gradient-to-br ${gradient} aspect-[3/4] p-4 flex flex-col justify-between text-white relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    <div className="relative z-10 flex gap-2">
                      <div className="text-xs uppercase tracking-wider opacity-80 bg-white/20 rounded px-2 py-1 inline-block">
                        {item.type.replace('_', ' ')}
                      </div>
                      {isRestricted && (
                        <div className="text-xs bg-amber-500 rounded px-2 py-1 inline-flex items-center gap-1">
                          🔒 {item.access_level.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-3">{item.title}</h3>
                      {author && <div className="text-sm opacity-90 line-clamp-1">{author}</div>}
                    </div>
                  </div>
                  )}
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    {author && <p className="text-sm text-gray-600 mb-2 line-clamp-1">{author}</p>}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                        {item.view_count}
                      </span>
                      <span className="text-blue-600 group-hover:underline font-medium">View Details →</span>
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => updateFilter('page', String(pagination.current_page - 1))}
              disabled={pagination.current_page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                .filter(page => {
                  // Show first, last, current, and 2 pages around current
                  return page === 1 || 
                         page === pagination.last_page || 
                         Math.abs(page - pagination.current_page) <= 2;
                })
                .map((page, idx, arr) => (
                  <>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span key={`ellipsis-${page}`} className="px-2 py-2">...</span>
                    )}
                    <button
                      key={page}
                      onClick={() => updateFilter('page', String(page))}
                      className={`px-4 py-2 rounded-lg ${
                        page === pagination.current_page
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </>
                ))}
            </div>

            <button
              onClick={() => updateFilter('page', String(pagination.current_page + 1))}
              disabled={pagination.current_page === pagination.last_page}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
