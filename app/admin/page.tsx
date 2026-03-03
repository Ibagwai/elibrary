'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const u = JSON.parse(userData)
      if (!['admin', 'super_admin'].includes(u.role)) {
        window.location.href = '/dashboard'
        return
      }
      setUser(u)
    } else {
      window.location.href = '/login'
    }

    // Fetch stats
    apiClient('/api/v1/admin/dashboard/stats')
    .then(res => res.json())
    .then(data => setStats(data.data))
    .catch(err => console.error(err))
  }, [])

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage content, users, and system settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📚</div>
              <div className="text-2xl font-bold text-blue-600">{stats?.total_content || 0}</div>
            </div>
            <div className="text-gray-600 text-sm">Total Content</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">👥</div>
              <div className="text-2xl font-bold text-green-600">{stats?.total_users || 0}</div>
            </div>
            <div className="text-gray-600 text-sm">Total Users</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📥</div>
              <div className="text-2xl font-bold text-purple-600">{stats?.total_downloads || 0}</div>
            </div>
            <div className="text-gray-600 text-sm">Total Downloads</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">⏳</div>
              <div className="text-2xl font-bold text-orange-600">{stats?.pending_approval || 0}</div>
            </div>
            <div className="text-gray-600 text-sm">Pending Approval</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/content" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Manage Content</h3>
            <p className="text-blue-100 text-sm">Add, edit, or remove library content</p>
          </Link>

          <Link href="/admin/users" className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
            <p className="text-green-100 text-sm">View and manage user accounts</p>
          </Link>

          <Link href="/admin/reports" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Reports</h3>
            <p className="text-purple-100 text-sm">View analytics and reports</p>
          </Link>
        </div>

        {/* Content by Type */}
        {stats?.content_by_type && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Content Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.content_by_type.map((item: any) => (
                <div key={item.type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{item.count}</div>
                  <div className="text-sm text-gray-600 capitalize">{item.type.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
