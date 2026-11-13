// Dynamic API base URL: Reads production Vercel env variable VITE_API_URL or defaults to localhost
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://localhost:5000/api';
  const clean = envUrl.trim().replace(/\/$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = getApiBase();


/**
 * Base request handler with JWT token injection
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, set JSON Content-Type
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Invalid response from server.',
  }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// Authentication API
export const authAPI = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  demoLogin: () =>
    request('/auth/demo', {
      method: 'POST',
    }),


  getProfile: () => request('/auth/profile'),

  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

// Resumes API
export const resumeAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return request('/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  },

  analyzeResume: (payload) =>
    request('/resumes/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getResumes: () => request('/resumes'),

  getResumeById: (id) => request(`/resumes/${id}`),

  deleteResume: (id) =>
    request(`/resumes/${id}`, {
      method: 'DELETE',
    }),
};

// Job Matching API
export const jobAPI = {
  analyzeJobMatch: (payload) =>
    request('/jobs/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getJobAnalyses: () => request('/jobs'),

  getJobAnalysisById: (id) => request(`/jobs/${id}`),

  deleteJobAnalysis: (id) =>
    request(`/jobs/${id}`, {
      method: 'DELETE',
    }),
};

// Career Assistant Chat API
export const chatAPI = {
  sendMessage: (message) =>
    request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getChatHistory: () => request('/chat/history'),

  clearChatHistory: () =>
    request('/chat/clear', {
      method: 'DELETE',
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => request('/dashboard/stats'),
};

