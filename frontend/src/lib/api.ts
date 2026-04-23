const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
}

// ─── Public API ───────────────────────────────────────────
export const publicApi = {
  getSettings: () => fetchApi('/public/settings', { next: { revalidate: 10 } }),
  getSections: (page?: string) =>
    fetchApi(`/public/sections${page ? `?page=${page}` : ''}`, { next: { revalidate: 10 } }),
  getPrograms: () => fetchApi('/public/programs', { next: { revalidate: 10 } }),
  getProgram: (slug: string) => fetchApi(`/public/programs/${slug}`, { next: { revalidate: 10 } }),
  getFacilities: () => fetchApi('/public/facilities', { next: { revalidate: 10 } }),
  getTestimtringify(data), token }),
  subscribeNewsletter: (email: string) =>
    fetchApi('/public/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
};

// ─── Admin API ────────────────────────────────────────────
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  refresh: (refreshToken: string) =>
    fetchApi('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  logout: (token: string, refreshToken?: string) =>
    fetchApi('/auth/logout', { method: 'POST', token, body: JSON.stringify({ refreshToken }) }),
  getMe: (token: string)
  getDashbo
    fetchApi('/admin/settings', { method: 'PUT', token, body: JSON.stringify(data) }),
};
