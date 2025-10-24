'use client';

import { notFound } from 'next/navigation';
import { useWebsite, useWebsitePreview } from '@/lib/hooks';
import { LoadingPage } from '@/components/ui/loading';
import { WebsitePreview } from '@/components/generate/website-preview';

interface PreviewPageProps {
  params: {
    id: string;
  };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { data: websiteData, isLoading, error } = useWebsite(params.id);
  const { data: previewData } = useWebsitePreview(params.id);

  if (isLoading) {
    return <LoadingPage message="Loading website preview..." />;
  }

  if (error || !websiteData?.data) {
    notFound();
  }

  const website = websiteData.data;

  // If we have preview data, use it; otherwise use the main website data
  const displayWebsite = previewData?.data ? {
    ...website,
    htmlContent: previewData.data.html,
    cssContent: previewData.data.css,
  } : website;

  return (
    <div className="space-y-6">
      <WebsitePreview website={displayWebsite} />
    </div>
  );
}
