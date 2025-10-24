'use client';

import { GenerateForm } from '@/components/generate/generate-form';
import { WebsitePreview } from '@/components/generate/website-preview';
import { useAppStore } from '@/lib/store';

export default function GeneratePage() {
  const { websites } = useAppStore();

  // Get the most recently generated website
  const latestWebsite = websites[0];

  return (
    <div className="space-y-8">
      <GenerateForm />
      
      {latestWebsite && (
        <div className="fade-in">
          <WebsitePreview website={latestWebsite} />
        </div>
      )}
    </div>
  );
}
