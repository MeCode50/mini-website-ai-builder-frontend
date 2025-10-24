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
                    <div className="p-8 text-center">
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
