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

  if (error || !websiteData?.data) {
    console.error('Preview Error:', { error, websiteData });
    notFound();
  }

  const website = websiteData.data;

  // If we have preview data, use it; otherwise use the main website data
  const displayWebsite = previewData?.data ? {
    ...website,
    htmlContent: previewData.data.html,
    cssContent: previewData.data.css,
  } : website;

  console.log('Display Website:', displayWebsite);

  return (
    <div className="space-y-6">
      <WebsitePreview website={displayWebsite} />
    </div>
  );
}
