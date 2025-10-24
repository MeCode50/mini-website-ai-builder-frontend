import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mini-website-ai-builder-production.up.railway.app/api/v1';

// Fallback website generator when AI fails
function createFallbackWebsite(data: GenerateWebsiteRequest): GenerateWebsiteResponse {
  const websiteId = `fallback-${Date.now()}`;
  const prompt = data.prompt.toLowerCase();
  
  // Determine website type from prompt
  let websiteContent = '';
  let cssContent = '';
  
  if (prompt.includes('fashion')) {
    websiteContent = `
      <div class="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white">
        <header class="bg-black/20 backdrop-blur-sm p-6">
          <div class="max-w-6xl mx-auto flex justify-between items-center">
            <h1 class="text-3xl font-bold">Fashion Store</h1>
            <nav class="hidden md:flex space-x-8">
              <a href="#" class="hover:text-pink-300 transition-colors">Collections</a>
              <a href="#" class="hover:text-pink-300 transition-colors">New Arrivals</a>
              <a href="#" class="hover:text-pink-300 transition-colors">Sale</a>
              <a href="#" class="hover:text-pink-300 transition-colors">Contact</a>
            </nav>
          </div>
        </header>
        <main class="p-8">
          <div class="max-w-6xl mx-auto text-center">
            <h1 class="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Modern Fashion
            </h1>
            <p class="text-xl mb-8 opacity-90">Discover the latest trends in fashion</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                <div class="w-full h-48 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg mb-4"></div>
                <h3 class="text-xl font-semibold">Summer Collection</h3>
                <p class="opacity-80">Fresh styles for the season</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                <div class="w-full h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg mb-4"></div>
                <h3 class="text-xl font-semibold">Evening Wear</h3>
                <p class="opacity-80">Elegant pieces for special occasions</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                <div class="w-full h-48 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg mb-4"></div>
                <h3 class="text-xl font-semibold">Casual Chic</h3>
                <p class="opacity-80">Comfortable yet stylish</p>
              </div>
            </div>
          </div>
        </main>
        <footer class="bg-black/30 backdrop-blur-sm p-6 text-center">
          <p class="opacity-80">© 2024 Fashion Store. All rights reserved.</p>
        </footer>
      </div>
    `;
  } else if (prompt.includes('photography') || prompt.includes('photographer')) {
    websiteContent = `
      <div class="min-h-screen bg-gray-900 text-white">
        <header class="bg-gray-800 p-4">
          <h1 class="text-2xl font-bold">Photographer's Portfolio</h1>
        </header>
        <main class="p-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">Professional Photography</h1>
            <p class="text-gray-300 mb-8">Capturing moments that last forever</p>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-gray-700 p-4 rounded">Gallery Item 1</div>
              <div class="bg-gray-700 p-4 rounded">Gallery Item 2</div>
              <div class="bg-gray-700 p-4 rounded">Gallery Item 3</div>
            </div>
          </div>
        </main>
        <footer class="bg-gray-800 p-4 text-center">
          <p>© 2022 Photographer's Portfolio</p>
        </footer>
      </div>
    `;
  } else {
    // Generic modern website
    websiteContent = `
      <div class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <header class="bg-black/20 backdrop-blur-sm p-6">
          <h1 class="text-3xl font-bold">${data.title || 'Modern Website'}</h1>
        </header>
        <main class="p-8 text-center">
          <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to ${data.title || 'Your Website'}
          </h1>
          <p class="text-xl mb-8 opacity-90">${data.description || 'A modern, responsive website built with the latest technologies'}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
              <h3 class="text-xl font-semibold mb-2">Modern Design</h3>
              <p class="opacity-80">Clean and contemporary</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
              <h3 class="text-xl font-semibold mb-2">Responsive</h3>
              <p class="opacity-80">Works on all devices</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
              <h3 class="text-xl font-semibold mb-2">Fast Loading</h3>
              <p class="opacity-80">Optimized performance</p>
            </div>
          </div>
        </main>
        <footer class="bg-black/30 backdrop-blur-sm p-6 text-center">
          <p class="opacity-80">Generated with AI Website Builder</p>
        </footer>
      </div>
    `;
  }

  const fallbackWebsite: Website = {
    id: websiteId,
    title: data.title || 'Generated Website',
    description: data.description || 'A beautiful website generated for you',
    prompt: data.prompt,
    htmlContent: websiteContent,
    cssContent: '', // Using Tailwind CSS classes
    isPublic: data.isPublic || false,
    createdAt: new Date().toISOString(),
    metadata: {
      theme: 'modern',
      category: prompt.includes('fashion') ? 'fashion' : prompt.includes('photography') ? 'photography' : 'general',
      features: ['responsive', 'modern-design', 'tailwind-css'],
      framework: 'html',
      styling: 'tailwind-css'
    }
  };

  return {
    success: true,
    data: fallbackWebsite,
    message: 'Website generated successfully (fallback mode)'
  };
}

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
  services?: {
    database: string;
    ai: string;
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
    console.error('=== FULL API ERROR DETAILS ===');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Response Status:', error.response?.status);
    console.error('Response Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Request URL:', error.config?.url);
    console.error('Request Method:', error.config?.method);
    console.error('Request Data:', error.config?.data);
    console.error('Full Error Object:', error);
    console.error('=== END ERROR DETAILS ===');
    
    // Handle specific production errors
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.error('Network error - check if backend is running');
    }
    
    // Handle database connection errors
    if (error.response?.data?.services?.database === 'unhealthy') {
      console.error('Backend database is unhealthy - check Railway logs');
    }
    
    // Handle 400 errors specifically
    if (error.response?.status === 400) {
      console.error('400 Bad Request - Check the request data and backend validation');
      console.error('Backend error message:', error.response?.data?.message);
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  // Generate a new website
  generateWebsite: async (data: GenerateWebsiteRequest): Promise<GenerateWebsiteResponse> => {
    console.log('Sending generate request:', {
      url: `${API_BASE_URL}/websites/generate`,
      data: data,
      timestamp: new Date().toISOString()
    });
    
    try {
      const response = await apiClient.post('/websites/generate', data);
      console.log('Generate response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Generate request failed:', error);
      
      // If AI generation fails, create a fallback website
      if (error?.response?.status === 400 && error?.response?.data?.message?.includes('incomplete')) {
        console.log('AI generation failed, creating fallback website...');
        return createFallbackWebsite(data);
      }
      
      throw error;
    }
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
