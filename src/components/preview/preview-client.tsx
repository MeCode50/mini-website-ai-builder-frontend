'use client';

import { notFound } from 'next/navigation';
import { useWebsite, useWebsitePreview } from '@/lib/hooks';
import { LoadingPage } from '@/components/ui/loading';
import { WebsitePreview } from '@/components/generate/website-preview';

interface PreviewClientProps {
  id: string;
}

export function PreviewClient({ id }: PreviewClientProps) {
  const { data: websiteData, isLoading, error } = useWebsite(id);
  const { data: previewData } = useWebsitePreview(id);

  // Debug logging
  console.log('Preview Debug:', {
    id,
    websiteData,
    previewData,
    isLoading,
    error
  });

  if (isLoading) {
    return <LoadingPage message="Loading website preview..." />;
  }

  if (error || !websiteData) {
    console.error('Preview Error:', { error, websiteData });
    notFound();
  }

  // Handle both wrapped and direct response structures
  const website = websiteData?.data || websiteData;

  // If we have preview data, use it; otherwise use the main website data
  const displayWebsite = previewData ? {
    ...website,
    htmlContent: (previewData as any)?.data?.html || (previewData as any)?.html || website.htmlContent,
    cssContent: (previewData as any)?.data?.css || (previewData as any)?.css || website.cssContent,
  } : website;

  console.log('Display Website:', displayWebsite);

  return (
    <div className="space-y-6">
      <WebsitePreview website={displayWebsite} />
    </div>
  );
}
