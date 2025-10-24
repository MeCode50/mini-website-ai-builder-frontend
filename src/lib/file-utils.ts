import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface WebsiteFiles {
  html: string;
  css: string;
  title: string;
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download HTML content as a file
 */
export const downloadHTML = (html: string, filename: string = 'website.html'): void => {
  const blob = new Blob([html], { type: 'text/html' });
  saveAs(blob, filename);
};

/**
 * Download CSS content as a file
 */
export const downloadCSS = (css: string, filename: string = 'styles.css'): void => {
  const blob = new Blob([css], { type: 'text/css' });
  saveAs(blob, filename);
};

/**
 * Download website as a ZIP file containing HTML and CSS
 */
export const downloadWebsiteAsZip = async (files: WebsiteFiles): Promise<void> => {
  try {
    const zip = new JSZip();
    
    // Add HTML file
    zip.file('index.html', files.html);
    
    // Add CSS file
    zip.file('styles.css', files.css);
    
    // Add a simple README
    const readme = `# ${files.title}

This website was generated using AI Website Builder.

## Files
- index.html - Main HTML file
- styles.css - CSS styles

## Usage
1. Open index.html in your web browser
2. The CSS file is already linked in the HTML

Generated on: ${new Date().toLocaleString()}
`;
    zip.file('README.md', readme);
    
    // Generate and download the ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${files.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip`);
  } catch (error) {
    console.error('Failed to create ZIP file:', error);
    throw new Error('Failed to create ZIP file');
  }
};

/**
 * Download Next.js project as a ZIP file
 */
export const downloadNextJSProjectAsZip = async (website: {
  title: string;
  htmlContent: string;
  cssContent: string;
  metadata?: {
    packageJson?: Record<string, unknown>;
  };
}): Promise<void> => {
  try {
    const zip = new JSZip();
    
    // Parse the Next.js content
    const nextjsContent = JSON.parse(website.htmlContent);
    
    // Add all Next.js files to ZIP
    Object.entries(nextjsContent).forEach(([filename, content]) => {
      if (typeof content === 'string') {
        zip.file(filename, content);
      } else if (typeof content === 'object' && content !== null) {
        // Handle nested components
        Object.entries(content).forEach(([componentName, componentContent]) => {
          if (typeof componentContent === 'string') {
            zip.file(`${filename}/${componentName}`, componentContent);
          }
        });
      }
    });
    
    // Add package.json
    if (website.metadata?.packageJson) {
      zip.file('package.json', JSON.stringify(website.metadata.packageJson, null, 2));
    } else {
      // Default package.json for Next.js project
      const defaultPackageJson = {
        name: website.title.toLowerCase().replace(/\s+/g, '-'),
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint'
        },
        dependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0'
        },
        devDependencies: {
          '@types/node': '^20.0.0',
          '@types/react': '^18.0.0',
          '@types/react-dom': '^18.0.0',
          eslint: '^8.0.0',
          'eslint-config-next': '^14.0.0',
          typescript: '^5.0.0'
        }
      };
      zip.file('package.json', JSON.stringify(defaultPackageJson, null, 2));
    }
    
    // Add tailwind.config.js
    zip.file('tailwind.config.js', website.cssContent);
    
    // Add next.config.js
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
`;
    zip.file('next.config.js', nextConfig);
    
    // Add tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'es6'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next'
          }
        ],
        paths: {
          '@/*': ['./src/*']
        }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    };
    zip.file('tsconfig.json', JSON.stringify(tsConfig, null, 2));
    
    // Add README
    const readme = `# ${website.title}

This Next.js project was generated using AI Website Builder.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- \`src/app/\` - Next.js App Router pages
- \`src/components/\` - React components
- \`tailwind.config.js\` - Tailwind CSS configuration
- \`package.json\` - Project dependencies

Generated on: ${new Date().toLocaleString()}
`;
    zip.file('README.md', readme);
    
    // Generate and download the ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    const filename = sanitizeFilename(website.title) + '.zip';
    saveAs(content, filename);
  } catch (error) {
    console.error('Failed to create Next.js ZIP file:', error);
    throw new Error('Failed to create Next.js project ZIP file');
  }
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date in a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

/**
 * Generate a preview thumbnail from HTML content
 */
export const generatePreviewThumbnail = (html: string): string => {
  // This is a placeholder - in a real app, you might use a service like Puppeteer
  // or a canvas-based solution to generate actual thumbnails
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
        Website Preview
      </text>
    </svg>
  `)}`;
};

/**
 * Extract title from HTML content
 */
export const extractTitleFromHTML = (html: string): string => {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  return 'Untitled Website';
};

/**
 * Validate HTML content
 */
export const validateHTML = (html: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Basic validation checks
  if (!html.includes('<html')) {
    errors.push('Missing <html> tag');
  }
  
  if (!html.includes('<body')) {
    errors.push('Missing <body> tag');
  }
  
  if (!html.includes('<head')) {
    errors.push('Missing <head> tag');
  }
  
  // Check for unclosed tags (basic check)
  const openTags = html.match(/<[^/][^>]*>/g) || [];
  const closeTags = html.match(/<\/[^>]*>/g) || [];
  
  if (openTags.length !== closeTags.length) {
    errors.push('Mismatched HTML tags');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize filename for download
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
    .replace(/^_|_$/g, '');
};
