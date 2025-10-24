import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Website, SystemHealth } from './api';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Websites
  websites: Website[];
  setWebsites: (websites: Website[]) => void;
  addWebsite: (website: Website) => void;
  updateWebsite: (id: string, updates: Partial<Website>) => void;
  removeWebsite: (id: string) => void;

  // System Health
  systemHealth: SystemHealth | null;
  setSystemHealth: (health: SystemHealth | null) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Generation State
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  generationProgress: number;
  setGenerationProgress: (progress: number) => void;

  // Search and Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPublic: boolean | null; // null = all, true = public only, false = private only
  setFilterPublic: (filter: boolean | null) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Websites
      websites: [],
      setWebsites: (websites) => set({ websites }),
      addWebsite: (website) => set((state) => ({ websites: [website, ...state.websites] })),
      updateWebsite: (id, updates) =>
        set((state) => ({
          websites: state.websites.map((website) =>
            website.id === id ? { ...website, ...updates } : website
          ),
        })),
      removeWebsite: (id) =>
        set((state) => ({ websites: state.websites.filter((website) => website.id !== id) })),

      // System Health
      systemHealth: null,
      setSystemHealth: (health) => set({ systemHealth: health }),

      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Generation State
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      generationProgress: 0,
      setGenerationProgress: (progress) => set({ generationProgress: progress }),

      // Search and Filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      filterPublic: null,
      setFilterPublic: (filter) => set({ filterPublic: filter }),

      // Pagination
      currentPage: 1,
      setCurrentPage: (page) => set({ currentPage: page }),
      totalPages: 1,
      setTotalPages: (pages) => set({ totalPages: pages }),
    }),
    {
      name: 'ai-website-builder-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        searchQuery: state.searchQuery,
        filterPublic: state.filterPublic,
      }),
    }
  )
);
