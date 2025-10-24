'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { NextJSProject } from '@/lib/api';
import { copyToClipboard } from '@/lib/file-utils';
import { toast } from 'sonner';

interface CodeViewerProps {
  nextjsContent: NextJSProject;
  selectedFile?: string;
  onFileSelect?: (filePath: string) => void;
}

export function CodeViewer({ nextjsContent, selectedFile, onFileSelect }: CodeViewerProps) {
  const files = Object.keys(nextjsContent);
  const defaultFile = selectedFile || files[0] || 'page.tsx';
  const currentCode = nextjsContent[defaultFile] as string || '';

  const handleCopyCode = async () => {
    const success = await copyToClipboard(currentCode);
    if (success) {
      toast.success('Code copied to clipboard');
    } else {
      toast.error('Failed to copy code');
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultFile;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${defaultFile}`);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) return '⚛️';
    if (filename.endsWith('.ts') || filename.endsWith('.js')) return '📄';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.json')) return '📋';
    return '📄';
  };

  const getLanguage = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.json')) return 'json';
    return 'text';
  };

  return (
    <div className="space-y-4">
      {/* File Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Select File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {files.map(file => (
              <Button
                key={file}
                variant={defaultFile === file ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFileSelect?.(file)}
                className="text-xs"
              >
                {getFileIcon(file)} {file}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center space-x-2">
              <span>{getFileIcon(defaultFile)}</span>
              <span>{defaultFile}</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadFile}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="code-block custom-scrollbar max-h-[500px] overflow-auto">
              <code className={`language-${getLanguage(defaultFile)}`}>
                {currentCode}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
