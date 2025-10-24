import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, GenerateWebsiteRequest, Website } from './api';
import { useAppStore } from './store';

// Query keys
export const queryKeys = {
  websites: ['websites'] as const,
  website: (id: string) => ['website', id] as const,
  publicWebsites: ['public-websites'] as const,
  systemHealth: ['system-health'] as const,
};

// Hooks for websites
export const useWebsites = (page = 1, limit = 12, search?: string) => {
  const { filterPublic } = useAppStore();
  
  return useQuery({
    queryKey: [...queryKeys.websites, page, limit, search, filterPublic],
    queryFn: () => {
      if (filterPublic === true) {
        return api.getPublicWebsites(page, limit);
      }
      return api.getWebsites(page, limit, search);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWebsite = (id: string) => {
  return useQuery({
    queryKey: queryKeys.website(id),
    queryFn: () => api.getWebsite(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useWebsitePreview = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.website(id), 'preview'],
    queryFn: () => api.getWebsitePreview(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: queryKeys.systemHealth,
    queryFn: () => api.getSystemHealth(),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 15 * 1000, // 15 seconds
  });
};

// Mutations
export const useGenerateWebsite = () => {
  const queryClient = useQueryClient();
  const { addWebsite, setIsGenerating, setGenerationProgress } = useAppStore();

  return useMutation({
    mutationFn: async (data: GenerateWebsiteRequest) => {
      setIsGenerating(true);
      setGenerationProgress(0);

      // Simulate progress updates
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        if (currentProgress >= 90) {
          clearInterval(progressInterval);
          return;
        }
        currentProgress += Math.random() * 10;
        setGenerationProgress(currentProgress);
      }, 500);

      try {
        const result = await api.generateWebsite(data);
        setGenerationProgress(100);
        
        // Add to store
        addWebsite(result.data);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: queryKeys.websites });
        queryClient.invalidateQueries({ queryKey: queryKeys.systemHealth });
        
        // Navigate to preview
        setTimeout(() => {
          window.location.href = `/preview/${result.data.id}`;
        }, 1000);
        
        return result;
      } finally {
        setIsGenerating(false);
        setGenerationProgress(0);
        clearInterval(progressInterval);
      }
    },
  });
};

export const useUpdateWebsite = () => {
  const queryClient = useQueryClient();
  const { updateWebsite } = useAppStore();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Website> }) => {
      const result = await api.updateWebsite(id, data);
      
      // Update store
      updateWebsite(id, data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.website(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.websites });
      
      return result;
    },
  });
};

export const useDeleteWebsite = () => {
  const queryClient = useQueryClient();
  const { removeWebsite } = useAppStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await api.deleteWebsite(id);
      
      // Remove from store
      removeWebsite(id);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.websites });
      queryClient.invalidateQueries({ queryKey: queryKeys.systemHealth });
      
      return result;
    },
  });
};
