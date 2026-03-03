'use client'

import { useState } from 'react'
import { login } from '@/lib/api/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const result = await login(email, password)
      if (result.data) {
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))
        window.location.href = '/browse'
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Login failed')
    }
  }

  const quickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Login (Test Users):</p>
          <div className="space-y-2">
            <button
              onClick={() => quickLogin('admin@k7library.com', 'password')}
              className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 text-sm"
            >
              <span className="font-medium text-purple-900">👑 Admin</span>
              <span className="text-gray-600 ml-2">admin@k7library.com</span>
            </button>
            
            <button
              onClick={() => quickLogin('faculty@k7library.com', 'password')}
              className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-sm"
            >
              <span className="font-medium text-blue-900">👨‍🏫 Faculty</span>
              <span className="text-gray-600 ml-2">faculty@k7library.com</span>
            </button>
            
            <button
              onClick={() => quickLogin('student@k7library.com', 'password')}
              className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 rounded border border-green-200 text-sm"
            >
              <span className="font-medium text-green-900">🎓 Student</span>
              <span className="text-gray-600 ml-2">student@k7library.com</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            All test accounts use password: <code className="bg-gray-100 px-2 py-1 rounded">password</code>
          </p>
        </div>
      </div>
    </main>
  )
}
