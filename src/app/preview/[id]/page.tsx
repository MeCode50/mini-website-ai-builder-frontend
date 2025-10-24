import { use } from 'react';
import { PreviewClient } from '@/components/preview/preview-client';

interface PreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params);
  
  return <PreviewClient id={id} />;
}
