const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8747';

// Reusable API client
export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Don't set Content-Type for FormData - browser will set it with boundary
  const isFormData = options.body instanceof FormData;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  return response;
}

export async function fetchContent(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiClient(`/api/v1/content?${query}`);
  return res.json();
}

export async function fetchContentBySlug(slug: string) {
  const res = await apiClient(`/api/v1/content/${slug}`);
  return res.json();
}

export async function fetchFeaturedContent() {
  const res = await apiClient('/api/v1/content/featured');
  return res.json();
}

export async function searchContent(query: string) {
  const res = await apiClient(`/api/v1/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await apiClient('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(data: any) {
  const res = await apiClient('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}
