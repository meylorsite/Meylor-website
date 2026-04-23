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
  getTestimonials: () => fetchApi('/public/testimonials', { next: { revalidate: 10 } }),
  getNews: (page = 1, limit = 12) =>
    fetchApi(`/public/news?page=${page}&limit=${limit}`, { next: { revalidate: 10 } }),
  getNewsPost: (slug: string) => fetchApi(`/public/news/${slug}`, { next: { revalidate: 10 } }),
  getGallery: () => fetchApi('/public/gallery', { next: { revalidate: 10 } }),
  getGalleryActivity: (slug: string) => fetchApi(`/public/gallery/${slug}`, { next: { revalidate: 10 } }),
  getJourney: () => fetchApi('/public/journey', { next: { revalidate: 10 } }),
  getPricing: () => fetchApi('/public/pricing', { next: { revalidate: 10 } }),
  getJobs: () => fetchApi('/public/jobs', { next: { revalidate: 10 } }),
  getJob: (slug: string) => fetchApi(`/public/jobs/${slug}`, { next: { revalidate: 10 } }),
  getStats: () => fetchApi('/public/stats', { next: { revalidate: 10 } }),
  getFAQs: (category?: string) =>
    fetchApi(`/public/faqs${category ? `?category=${category}` : ''}`, { next: { revalidate: 10 } }),
  getTeam: (category?: string) =>
    fetchApi(`/public/team${category ? `?category=${category}` : ''}`, { next: { revalidate: 10 } }),

  // Form submissions
  submitContact: (data: any) =>
    fetchApi('/public/contact', { method: 'POST', body: JSON.stringify(data) }),
  submitComplaint: (data: any) =>
    fetchApi('/public/complaints', { method: 'POST', body: JSON.stringify(data) }),
  submitApplication: (data: any) =>
    fetchApi('/public/applications', { method: 'POST', body: JSON.stringify(data) }),
  submitAdmission: (data: any, token?: string) =>
    fetchApi('/public/admissions', { method: 'POST', body: JSON.stringify(data), token }),
  submitTestimonial: (data: any, token?: string) =>
    fetchApi('/public/testimonials', { method: 'POST', body: JSON.stringify(data), token }),
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
  getMe: (token: string) => fetchApi('/auth/me', { token }),
  getMyAdmissions: (token: string) => fetchApi('/auth/my-admissions', { token }),
  changePassword: (token: string, currentPassword: string, newPassword: string) =>
    fetchApi('/auth/change-password', {
      method: 'PUT',
      token,
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  updateProfile: (data: any, token: string) =>
    fetchApi('/auth/profile', { method: 'PUT', token, body: JSON.stringify(data) }),

  // Dashboard
  getDashboard: (token: string) => fetchApi('/admin/dashboard', { token }),

  // Generic CRUD
  getAll: (resource: string, token: string, params = '') =>
    fetchApi(`/admin/${resource}${params ? `?${params}` : ''}`, { token }),
  getOne: (resource: string, id: string, token: string) =>
    fetchApi(`/admin/${resource}/${id}`, { token }),
  create: (resource: string, data: any, token: string) =>
    fetchApi(`/admin/${resource}`, { method: 'POST', token, body: JSON.stringify(data) }),
  update: (resource: string, id: string, data: any, token: string) =>
    fetchApi(`/admin/${resource}/${id}`, { method: 'PUT', token, body: JSON.stringify(data) }),
  remove: (resource: string, id: string, token: string) =>
    fetchApi(`/admin/${resource}/${id}`, { method: 'DELETE', token }),
  reorder: (resource: string, items: { id: string; order: number }[], token: string) =>
    fetchApi(`/admin/${resource}-reorder`, {
      method: 'PUT',
      token,
      body: JSON.stringify({ items }),
    }),

  // Settings
  getSettings: (token: string) => fetchApi('/admin/settings', { token }),
  updateSettings: (data: any, token: string) =>
    fetchApi('/admin/settings', { method: 'PUT', token, body: JSON.stringify(data) }),
};
