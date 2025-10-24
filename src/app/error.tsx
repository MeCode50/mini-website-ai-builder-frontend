'use client';

import { useEffect } from 'react';
import { ErrorPage } from '@/components/ui/error';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      title="Something went wrong!"
      message="An unexpected error occurred. Please try again."
      onRetry={reset}
    />
  );
}
