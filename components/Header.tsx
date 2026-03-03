'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { branding } from '@/lib/theme'
import ThemeToggle from './shared/ThemeToggle'

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-2xl">{branding.logoIcon}</span>
            </div>
            <div>
              <div className="font-bold text-xl">{branding.appName}</div>
              <div className="text-xs text-blue-200">{branding.appTagline}</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/browse" 
              className={`hover:text-blue-200 transition-colors ${pathname === '/browse' ? 'text-white font-semibold' : 'text-blue-100'}`}
            >
              Browse
            </Link>
            <Link 
              href="/search" 
              className={`hover:text-blue-200 transition-colors ${pathname === '/search' ? 'text-white font-semibold' : 'text-blue-100'}`}
            >
              Search
            </Link>
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`hover:text-blue-200 transition-colors ${pathname === '/dashboard' ? 'text-white font-semibold' : 'text-blue-100'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/library" 
                  className={`hover:text-blue-200 transition-colors ${pathname === '/library' ? 'text-white font-semibold' : 'text-blue-100'}`}
                >
                  My Library
                </Link>
                {['admin', 'super_admin'].includes(user.role) && (
                  <Link 
                    href="/admin" 
                    className={`hover:text-blue-200 transition-colors ${pathname.startsWith('/admin') ? 'text-white font-semibold' : 'text-blue-100'}`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-blue-200 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="px-6 py-2 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-600 animate-fadeIn">
            <Link href="/browse" className="block py-2 hover:text-blue-200">Browse</Link>
            <Link href="/search" className="block py-2 hover:text-blue-200">Search</Link>
            {user && (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-blue-200">Dashboard</Link>
                <Link href="/library" className="block py-2 hover:text-blue-200">My Library</Link>
              </>
            )}
            <div className="pt-4 border-t border-blue-600 mt-4">
              {user ? (
                <>
                  <div className="text-sm mb-2">{user.name} ({user.role})</div>
                  <button onClick={handleLogout} className="text-sm text-blue-200">Logout</button>
                </>
              ) : (
                <Link href="/login" className="block py-2 bg-white text-blue-900 rounded-lg text-center">Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
