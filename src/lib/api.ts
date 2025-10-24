import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mini-website-ai-builder-production.up.railway.app/api/v1';

export interface Website {
  id: string;
  title: string;
  description: string;
  prompt: string;
  htmlContent: string; // Now contains JSON string with Next.js files
  cssContent: string; // Now contains Tailwind config
  isPublic: boolean;
  createdAt: string;
  metadata?: {
    theme?: string;
    category?: string;
    features?: string[];
    framework?: string;
    styling?: string;
    packageJson?: Record<string, unknown>;
  };
}

export interface NextJSProject {
  'page.tsx'?: string;
  'layout.tsx'?: string;
  'globals.css'?: string;
  components?: Record<string, string>;
  [key: string]: string | Record<string, string> | undefined;
}

export interface GenerateWebsiteRequest {
  prompt: string;
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface GenerateWebsiteResponse {
  success: boolean;
  data: Website;
  message?: string;
}

export interface WebsitesListResponse {
  success: boolean;
  data: {
    websites: Website[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  stats: {
    totalWebsites: number;
    publicWebsites: number;
    privateWebsites: number;
    generationSuccessRate: number;
    averageGenerationTime: number;
  };
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for generation (increased for production)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle specific production errors
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.error('Network error - check if backend is running');
    }
    
    // Handle database connection errors
    if (error.response?.data?.services?.database === 'unhealthy') {
      console.error('Backend database is unhealthy - check Railway logs');
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  // Generate a new website
  generateWebsite: async (data: GenerateWebsiteRequest): Promise<GenerateWebsiteResponse> => {
    const response = await apiClient.post('/websites/generate', data);
    return response.data;
  },

  // Get all websites with pagination
  getWebsites: async (page = 1, limit = 12, search?: string): Promise<WebsitesListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    const response = await apiClient.get(`/websites?${params}`);
    return response.data;
  },

  // Get public websites only
  getPublicWebsites: async (page = 1, limit = 12): Promise<WebsitesListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get(`/websites/public?${params}`);
    return response.data;
  },

  // Get a specific website by ID
  getWebsite: async (id: string): Promise<{ success: boolean; data: Website }> => {
    const response = await apiClient.get(`/websites/${id}`);
    return response.data;
  },

  // Get website preview (HTML/CSS)
  getWebsitePreview: async (id: string): Promise<{ success: boolean; data: { html: string; css: string } }> => {
    const response = await apiClient.get(`/websites/${id}/preview`);
    return response.data;
  },

  // Get system health and stats
  getSystemHealth: async (): Promise<{ success: boolean; data: SystemHealth }> => {
    const response = await apiClient.get('/health/detailed');
    return response.data;
  },

  // Update website (if backend supports it)
  updateWebsite: async (id: string, data: Partial<Website>): Promise<{ success: boolean; data: Website }> => {
    const response = await apiClient.put(`/websites/${id}`, data);
    return response.data;
  },

  // Delete website (if backend supports it)
  deleteWebsite: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/websites/${id}`);
    return response.data;
  },
};

export default api;
