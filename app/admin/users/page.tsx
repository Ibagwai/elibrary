'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  is_active?: boolean;
  created_at: string;
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800',
  faculty: 'bg-blue-100 text-blue-800',
  student: 'bg-green-100 text-green-800',
  guest: 'bg-gray-100 text-gray-800',
};

const ROLE_ICONS: Record<string, string> = {
  super_admin: '👑',
  admin: '🛡️',
  faculty: '👨‍🏫',
  student: '🎓',
  guest: '👤',
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, byRole: {} });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [search, roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (roleFilter) params.append('role', roleFilter);

    try {
      const res = await apiClient(`/api/v1/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.data?.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  }

  async function fetchStats() {
    try {
      const res = await apiClient('/api/v1/admin/users/stats');
      const data = await res.json();
      setStats(data.data || { total: 0, active: 0, byRole: {} });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  async function toggleUserStatus(id: string, currentStatus?: boolean) {
    try {
      await apiClient(`/api/v1/admin/users/${id}/toggle-status`, {
        method: 'POST',
      });
      fetchUsers();
    } catch (error) {
      alert('Error updating user status');
    }
  }

  async function changeUserRole(id: string, newRole: string) {
    try {
      await apiClient(`/api/v1/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
      fetchStats();
    } catch (error) {
      alert('Error changing user role');
    }
  }

  async function deleteUser(id: string) {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await apiClient(`/api/v1/admin/users/${id}`, {
        method: 'DELETE',
      });
      fetchUsers();
      fetchStats();
    } catch (error) {
      alert('Error deleting user');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Active</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
          {Object.entries(ROLE_ICONS).map(([role, icon]) => (
            <div key={role} className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <span>{icon}</span>
                {role.replace('_', ' ')}
              </div>
              <div className="text-2xl font-bold">{(stats.byRole as any)[role] || 0}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Roles</option>
              <option value="super_admin">👑 Super Admin</option>
              <option value="admin">🛡️ Admin</option>
              <option value="faculty">👨‍🏫 Faculty</option>
              <option value="student">🎓 Student</option>
              <option value="guest">👤 Guest</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400">No users found</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => changeUserRole(user.id, e.target.value)}
                        className={`px-3 py-1 text-xs rounded-full font-medium ${ROLE_COLORS[user.role] || 'bg-gray-100'}`}
                      >
                        <option value="super_admin">👑 Super Admin</option>
                        <option value="admin">🛡️ Admin</option>
                        <option value="faculty">👨‍🏫 Faculty</option>
                        <option value="student">🎓 Student</option>
                        <option value="guest">👤 Guest</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.department || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.is_active ? '✓ Active' : '✗ Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
