'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FrameworkBadgesProps {
  metadata?: {
    framework?: string;
    styling?: string;
    packageJson?: Record<string, unknown>;
  };
  className?: string;
}

export function FrameworkBadges({ metadata, className }: FrameworkBadgesProps) {
  const frameworks = [];
  
  // Add framework
  if (metadata?.framework) {
    frameworks.push({
      name: metadata.framework,
      variant: 'default' as const,
      icon: '⚛️'
    });
  }

  // Add styling frameworks
  if (metadata?.styling) {
    const stylingParts = metadata.styling.split(' + ');
    stylingParts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed.toLowerCase().includes('tailwind')) {
        frameworks.push({
          name: 'Tailwind CSS',
          variant: 'secondary' as const,
          icon: '🎨'
        });
      }
      if (trimmed.toLowerCase().includes('shadcn')) {
        frameworks.push({
          name: 'shadcn/ui',
          variant: 'outline' as const,
          icon: '🎭'
        });
      }
    });
  }

  // Add additional frameworks from package.json
  if (metadata?.packageJson?.dependencies) {
    const deps = metadata.packageJson.dependencies as Record<string, string>;
    if (deps['next']) {
      frameworks.push({
        name: 'Next.js',
        variant: 'default' as const,
        icon: '⚡'
      });
    }
    if (deps['react']) {
      frameworks.push({
        name: 'React',
        variant: 'secondary' as const,
        icon: '⚛️'
      });
    }
    if (deps['typescript']) {
      frameworks.push({
        name: 'TypeScript',
        variant: 'outline' as const,
        icon: '📘'
      });
    }
  }

  // Remove duplicates
  const uniqueFrameworks = frameworks.filter((framework, index, self) => 
    index === self.findIndex(f => f.name === framework.name)
  );

  if (uniqueFrameworks.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {uniqueFrameworks.map((framework, index) => (
        <Badge 
          key={index}
          variant={framework.variant}
          className="text-xs"
        >
          <span className="mr-1">{framework.icon}</span>
          {framework.name}
        </Badge>
      ))}
    </div>
  );
}
