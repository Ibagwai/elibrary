'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function AdminReportsPage() {
  const [stats, setStats] = useState({
    totalContent: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalViews: 0,
  });
  const [popular, setPopular] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [contentByType, setContentByType] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    
    try {
      // Fetch content stats
      const contentRes = await apiClient('/api/v1/content?per_page=1000');
      const contentData = await contentRes.json();
      const allContent = contentData.data?.data || [];
      
      // Calculate stats
      const totalDownloads = allContent.reduce((sum: number, item: any) => sum + (item.download_count || 0), 0);
      const totalViews = allContent.reduce((sum: number, item: any) => sum + (item.view_count || 0), 0);
      
      // Group by type
      const byType = allContent.reduce((acc: any, item: any) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalContent: allContent.length,
        totalUsers: 0, // Will fetch separately
        totalDownloads,
        totalViews,
      });
      setContentByType(byType);

      // Get most popular (sort by views)
      const sortedByViews = [...allContent].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      setPopular(sortedByViews.slice(0, 10));

      // Get recent activity (sort by updated_at)
      const sortedByDate = [...allContent].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setRecentActivity(sortedByDate.slice(0, 10));

      // Fetch user count
      const usersRes = await apiClient('/api/v1/admin/users');
      const usersData = await usersRes.json();
      setStats(prev => ({ ...prev, totalUsers: usersData.data?.data?.length || 0 }));

    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <button onClick={fetchReports} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            🔄 Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Content</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalContent}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-green-600">{stats.totalUsers}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Downloads</div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalDownloads}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Views</div>
            <div className="text-3xl font-bold text-orange-600">{stats.totalViews}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content by Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Content by Type</h2>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(contentByType).map(([type, count]: any) => (
                  <div key={type} className="flex justify-between items-center py-3 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {type === 'ebook' ? '📚' : type === 'journal' ? '📰' : type === 'student_project' ? '🎓' : '🎬'}
                      </span>
                      <span className="font-medium capitalize">{type.replace('_', ' ')}</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Most Popular Content</h2>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : popular.length > 0 ? (
              <div className="space-y-3">
                {popular.map((item: any, idx: number) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <span className="text-xl font-bold text-gray-400">#{idx + 1}</span>
                    <div className="flex-1">
                      <a href={`/content/${item.id}`} className="font-medium hover:text-blue-600">{item.title}</a>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>👁 {item.view_count || 0} views</span>
                        <span>📥 {item.download_count || 0} downloads</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No content yet</div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : recentActivity.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Content</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Views</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentActivity.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <a href={`/content/${item.id}`} className="font-medium hover:text-blue-600">{item.title}</a>
                        </td>
                        <td className="px-4 py-3 text-sm capitalize">{item.type.replace('_', ' ')}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'published' ? 'bg-green-100 text-green-800' : 
                            item.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.view_count || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(item.updated_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No activity yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
