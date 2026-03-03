import { fetchContent } from '@/lib/api/client'

async function getStats() {
  try {
    const data = await fetchContent({ per_page: 1000 })
    const content = data.data?.data || []
    
    const counts = {
      ebook: 0,
      journal: 0,
      student_project: 0,
      lecture: 0
    }
    
    content.forEach((item: any) => {
      if (counts.hasOwnProperty(item.type)) {
        counts[item.type as keyof typeof counts]++
      }
    })
    
    return counts
  } catch {
    return { ebook: 0, journal: 0, student_project: 0, lecture: 0 }
  }
}

export default async function Home() {
  const stats = await getStats()
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 animate-fadeIn">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-slideUp">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Gateway to Knowledge
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Access thousands of ebooks, peer-reviewed journals, research projects, and multimedia lectures
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/browse" className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                📚 Browse Content
              </a>
              <a href="/search" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all">
                🔍 Search Library
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="animate-scaleIn">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.ebook}</div>
              <div className="text-gray-600">Ebooks</div>
            </div>
            <div className="animate-scaleIn" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.journal}</div>
              <div className="text-gray-600">Journals</div>
            </div>
            <div className="animate-scaleIn" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.student_project}</div>
              <div className="text-gray-600">Projects</div>
            </div>
            <div className="animate-scaleIn" style={{animationDelay: '0.3s'}}>
              <div className="text-4xl font-bold text-orange-600 mb-2">{stats.lecture}</div>
              <div className="text-gray-600">Lectures</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/browse?type=ebook" className="group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white transform group-hover:scale-105 transition-all">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-2">Ebooks</h3>
                <p className="text-blue-100 mb-4">Digital books across all disciplines</p>
                <div className="text-sm font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Browse Ebooks →
                </div>
              </div>
            </a>

            <a href="/browse?type=journal" className="group">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-8 text-white transform group-hover:scale-105 transition-all">
                <div className="text-5xl mb-4">📰</div>
                <h3 className="text-2xl font-bold mb-2">Journals</h3>
                <p className="text-green-100 mb-4">Peer-reviewed research articles</p>
                <div className="text-sm font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Browse Journals →
                </div>
              </div>
            </a>

            <a href="/browse?type=student_project" className="group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-8 text-white transform group-hover:scale-105 transition-all">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold mb-2">Projects</h3>
                <p className="text-purple-100 mb-4">Student research and theses</p>
                <div className="text-sm font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Browse Projects →
                </div>
              </div>
            </a>

            <a href="/browse?type=lecture" className="group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-8 text-white transform group-hover:scale-105 transition-all">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-2xl font-bold mb-2">Lectures</h3>
                <p className="text-orange-100 mb-4">Video and audio content</p>
                <div className="text-sm font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Browse Lectures →
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose K7 E-Library?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Search</h3>
              <p className="text-gray-600">Find what you need instantly with our powerful search engine</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Access your library anywhere, on any device</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-gray-600">Your data and reading history are protected</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
