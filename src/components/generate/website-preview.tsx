'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Website } from '@/lib/api';
import { copyToClipboard, downloadHTML, downloadCSS, downloadNextJSProjectAsZip, downloadWebsiteAsZip } from '@/lib/file-utils';
import { Eye, Code, Download, Copy, Monitor, Tablet, Smartphone, FolderTree } from 'lucide-react';
import { toast } from 'sonner';
import { FileTree } from '@/components/ui/file-tree';
import { CodeViewer } from '@/components/ui/code-viewer';
import { FrameworkBadges } from '@/components/ui/framework-badges';

interface WebsitePreviewProps {
  website: Website;
}

// Function to convert Next.js components to HTML for live preview
function generateLivePreviewHTML(nextjsContent: any, website: any): string {
  try {
    // Extract the main page content
    const pageContent = nextjsContent['page.tsx'] || '';
    const layoutContent = nextjsContent['layout.tsx'] || '';
    const globalsCSS = nextjsContent['globals.css'] || '';
    
    // Extract component content
    const components = nextjsContent.components || {};
    
    // If we have actual generated content, use it instead of fallback
    if (pageContent && pageContent.length > 50) {
      // Convert JSX to HTML for preview
      let htmlContent = pageContent
        .replace(/import.*?from.*?;?\n/g, '') // Remove imports
        .replace(/export default function.*?{/, '') // Remove function declaration
        .replace(/return \(/, '') // Remove return statement
        .replace(/\);$/, '') // Remove closing
        .replace(/className=/g, 'class=') // Convert className to class
        .replace(/'/g, '"') // Convert single quotes to double quotes
        .trim();

      // Add basic HTML structure with Tailwind CSS
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${website.title || 'Generated Website'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
            ${globalsCSS}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
    }
    
    // Fallback to type-based generation for simple content
    const prompt = website.prompt?.toLowerCase() || '';
    const title = website.title?.toLowerCase() || '';
    const description = website.description?.toLowerCase() || '';
    
    let htmlContent = '';
    
    if (prompt.includes('fashion') || title.includes('fashion') || description.includes('fashion')) {
      // Fashion website with flashy colors
      htmlContent = `
        <div class="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white">
          <header class="bg-black/20 backdrop-blur-sm p-6">
            <div class="max-w-6xl mx-auto flex justify-between items-center">
              <h1 class="text-3xl font-bold">Fashion Store</h1>
              <nav class="hidden md:flex space-x-8">
                <a href="#" class="hover:text-pink-300 transition-colors">Collections</a>
                <a href="#" class="hover:text-pink-300 transition-colors">New Arrivals</a>
                <a href="#" class="hover:text-pink-300 transition-colors">Sale</a>
                <a href="#" class="hover:text-pink-300 transition-colors">Contact</a>
              </nav>
            </div>
          </header>
          <main class="p-8">
            <div class="max-w-6xl mx-auto text-center">
              <h1 class="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Modern Fashion
              </h1>
              <p class="text-xl mb-8 opacity-90">Discover the latest trends in fashion</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                  <div class="w-full h-48 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg mb-4"></div>
                  <h3 class="text-xl font-semibold">Summer Collection</h3>
                  <p class="opacity-80">Fresh styles for the season</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                  <div class="w-full h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg mb-4"></div>
                  <h3 class="text-xl font-semibold">Evening Wear</h3>
                  <p class="opacity-80">Elegant pieces for special occasions</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                  <div class="w-full h-48 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg mb-4"></div>
                  <h3 class="text-xl font-semibold">Casual Chic</h3>
                  <p class="opacity-80">Comfortable yet stylish</p>
                </div>
              </div>
            </div>
          </main>
          <footer class="bg-black/30 backdrop-blur-sm p-6 text-center">
            <p class="opacity-80">© 2024 Fashion Store. All rights reserved.</p>
          </footer>
        </div>
      `;
    } else if (prompt.includes('photography') || prompt.includes('photographer')) {
      // Photography website
      htmlContent = `
        <div class="min-h-screen bg-gray-900 text-white">
          <header class="bg-gray-800 p-4">
            <h1 class="text-2xl font-bold">Photographer's Portfolio</h1>
          </header>
          <main class="p-8">
            <div class="text-center">
              <h1 class="text-4xl font-bold mb-4">Professional Photography</h1>
              <p class="text-gray-300 mb-8">Capturing moments that last forever</p>
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-gray-700 p-4 rounded">Gallery Item 1</div>
                <div class="bg-gray-700 p-4 rounded">Gallery Item 2</div>
                <div class="bg-gray-700 p-4 rounded">Gallery Item 3</div>
              </div>
            </div>
          </main>
          <footer class="bg-gray-800 p-4 text-center">
            <p>© 2022 Photographer's Portfolio</p>
          </footer>
        </div>
      `;
    } else if (prompt.includes('restaurant') || prompt.includes('food')) {
      // Restaurant website
      htmlContent = `
        <div class="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 text-white">
          <header class="bg-black/20 backdrop-blur-sm p-6">
            <h1 class="text-3xl font-bold">Restaurant Name</h1>
          </header>
          <main class="p-8 text-center">
            <h1 class="text-5xl font-bold mb-4">Delicious Food</h1>
            <p class="text-xl mb-8">Experience culinary excellence</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">Appetizers</div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">Main Course</div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">Desserts</div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">Beverages</div>
            </div>
          </main>
          <footer class="bg-black/30 backdrop-blur-sm p-6 text-center">
            <p>© 2024 Restaurant. All rights reserved.</p>
          </footer>
        </div>
      `;
    } else {
      // Generic modern website with flashy colors
      htmlContent = `
        <div class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <header class="bg-black/20 backdrop-blur-sm p-6">
            <h1 class="text-3xl font-bold">${website.title || 'Modern Website'}</h1>
          </header>
          <main class="p-8 text-center">
            <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to ${website.title || 'Your Website'}
            </h1>
            <p class="text-xl mb-8 opacity-90">${website.description || 'A modern, responsive website built with the latest technologies'}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                <h3 class="text-xl font-semibold mb-2">Modern Design</h3>
                <p class="opacity-80">Clean and contemporary</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                <h3 class="text-xl font-semibold mb-2">Responsive</h3>
                <p class="opacity-80">Works on all devices</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all">
                <h3 class="text-xl font-semibold mb-2">Fast Loading</h3>
                <p class="opacity-80">Optimized performance</p>
              </div>
            </div>
          </main>
          <footer class="bg-black/30 backdrop-blur-sm p-6 text-center">
            <p class="opacity-80">Generated with AI Website Builder</p>
          </footer>
        </div>
      `;
    }

    // Add basic HTML structure with Tailwind CSS
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${website.title || 'Generated Website'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
          ${globalsCSS}
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  } catch (error) {
    console.error('Error generating live preview:', error);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Preview Error</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="p-8 bg-gray-100">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-800">Preview Error</h1>
          <p class="text-gray-600 mt-2">Unable to generate live preview</p>
        </div>
      </body>
      </html>
    `;
  }
}

export function WebsitePreview({ website }: WebsitePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'files' | 'code'>('preview');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedFile, setSelectedFile] = useState<string>('');

  // Check if this is a Next.js project or legacy HTML/CSS
  const isNextJSProject = website.metadata?.framework === 'Next.js' || 
                         website.htmlContent.startsWith('{') ||
                         website.metadata?.styling?.includes('Next.js');

  let nextjsContent = null;
  if (isNextJSProject) {
    try {
      nextjsContent = JSON.parse(website.htmlContent);
    } catch (error) {
      console.error('Failed to parse Next.js content:', error);
    }
  }

  const handleDownloadZip = async () => {
    try {
      if (isNextJSProject) {
        await downloadNextJSProjectAsZip(website);
      } else {
        // Fallback to legacy HTML/CSS download
        await downloadWebsiteAsZip({
          html: website.htmlContent,
          css: website.cssContent,
          title: website.title || 'website',
        });
      }
      toast.success('Project ZIP downloaded');
    } catch {
      toast.error('Failed to download ZIP file');
    }
  };

  const deviceClasses = {
    desktop: 'w-full',
    tablet: 'max-w-2xl mx-auto',
    mobile: 'max-w-sm mx-auto',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{website.title || 'Generated Website'}</h2>
          {website.description && (
            <p className="text-muted-foreground">{website.description}</p>
          )}
          <div className="mt-2">
            <FrameworkBadges metadata={website.metadata} />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleDownloadZip}>
            <Download className="w-4 h-4 mr-2" />
            {isNextJSProject ? 'Download Project' : 'Download ZIP'}
          </Button>
        </div>
      </div>

      {/* Device View Toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">View:</span>
        <div className="flex space-x-1">
          <Button
            variant={deviceView === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceView('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceView === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceView('tablet')}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceView === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceView('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'files' | 'code')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center space-x-2">
            <FolderTree className="w-4 h-4" />
            <span>Files</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Code</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`border rounded-lg overflow-hidden ${deviceClasses[deviceView]}`}>
                <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
                  {website.title || 'Generated Website'}
                </div>
                <div className="bg-background">
                  {isNextJSProject ? (
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <div className="text-6xl mb-4">⚛️</div>
                        <h3 className="text-xl font-semibold mb-2">Next.js Project Generated</h3>
                        <p className="text-muted-foreground mb-4">
                          This is a complete Next.js project. Download the ZIP file to run it locally.
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>📦 Complete project structure</p>
                          <p>⚡ Next.js App Router</p>
                          <p>🎨 Tailwind CSS + shadcn/ui</p>
                          <p>📘 TypeScript support</p>
                        </div>
                      </div>
                      
                      {/* Live Preview of the Website */}
                      {nextjsContent && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-4">Live Preview:</h4>
                          <div className="border rounded-lg overflow-hidden bg-white">
                            <div className="bg-gray-100 px-4 py-2 text-sm font-medium border-b flex items-center">
                              <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              </div>
                              <span className="ml-4 text-gray-600">Live Preview</span>
                            </div>
                            <div className="p-0">
                              <iframe
                                srcDoc={generateLivePreviewHTML(nextjsContent, website)}
                                className="w-full h-[600px] border-0"
                                title="Live Website Preview"
                                sandbox="allow-scripts"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Show a preview of the main page content */}
                      {nextjsContent && (
                        <div className="mt-6 p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold mb-2">Preview of Generated Content:</h4>
                          <div className="text-sm text-muted-foreground">
                            {nextjsContent['page.tsx'] && (
                              <div className="mb-2">
                                <strong>Main Page:</strong>
                                <pre className="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                                  {nextjsContent['page.tsx'].substring(0, 200)}...
                                </pre>
                              </div>
                            )}
                            {nextjsContent.components && (
                              <div>
                                <strong>Components:</strong>
                                <div className="mt-1 text-xs">
                                  {Object.keys(nextjsContent.components).map(component => (
                                    <span key={component} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded mr-2 mb-1">
                                      {component}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${website.title || 'Generated Website'}</title>
                            <style>${website.cssContent}</style>
                          </head>
                          <body>
                            ${website.htmlContent}
                          </body>
                        </html>
                      `}
                      className="w-full h-[600px] border-0"
                      title="Website Preview"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              {isNextJSProject && nextjsContent ? (
                <FileTree 
                  nextjsContent={nextjsContent}
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">📄</div>
                  <p>Legacy HTML/CSS format</p>
                  <p className="text-sm">Files: index.html, styles.css</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="mt-6">
          {isNextJSProject && nextjsContent ? (
            <CodeViewer 
              nextjsContent={nextjsContent}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>HTML Code</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={async () => {
                        const success = await copyToClipboard(website.htmlContent);
                        if (success) {
                          toast.success('HTML copied to clipboard');
                        } else {
                          toast.error('Failed to copy HTML');
                        }
                      }}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        downloadHTML(website.htmlContent, `${website.title || 'website'}.html`);
                        toast.success('HTML file downloaded');
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="code-block custom-scrollbar max-h-[500px] overflow-auto">
                    <code>{website.htmlContent}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>CSS Code</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={async () => {
                        const success = await copyToClipboard(website.cssContent);
                        if (success) {
                          toast.success('CSS copied to clipboard');
                        } else {
                          toast.error('Failed to copy CSS');
                        }
                      }}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        downloadCSS(website.cssContent, `${website.title || 'website'}.css`);
                        toast.success('CSS file downloaded');
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="code-block custom-scrollbar max-h-[500px] overflow-auto">
                    <code>{website.cssContent}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
