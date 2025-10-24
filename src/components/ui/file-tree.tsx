'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { NextJSProject } from '@/lib/api';

interface FileTreeProps {
  nextjsContent: NextJSProject;
  selectedFile?: string;
  onFileSelect?: (filePath: string) => void;
}

interface FileItemProps {
  name: string;
  path: string;
  isDirectory: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  children?: React.ReactNode;
}

function FileItem({ 
  name, 
  path, 
  isDirectory, 
  isExpanded = false, 
  onToggle, 
  onSelect, 
  isSelected = false,
  children 
}: FileItemProps) {
  const Icon = isDirectory 
    ? (isExpanded ? FolderOpen : Folder)
    : File;

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center space-x-2 px-2 py-1 rounded hover:bg-muted/50 cursor-pointer text-sm',
          isSelected && 'bg-accent text-accent-foreground'
        )}
        onClick={isDirectory ? onToggle : onSelect}
      >
        {isDirectory && (
          <button
            className="p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        {!isDirectory && <div className="w-3" />}
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{name}</span>
      </div>
      {isDirectory && isExpanded && children && (
        <div className="ml-4 border-l border-border pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function FileTree({ nextjsContent, selectedFile, onFileSelect }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['components']));

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = (filePath: string) => {
    onFileSelect?.(filePath);
  };

  // Organize files into structure
  const files = Object.keys(nextjsContent);
  const rootFiles = files.filter(file => !file.includes('/'));
  const componentFiles = files.filter(file => file.startsWith('components/'));

  return (
    <div className="file-tree bg-muted/30 rounded-lg p-3 space-y-1">
      <div className="text-xs font-medium text-muted-foreground mb-2">Project Structure</div>
      
      {/* Root files */}
      {rootFiles.map(file => (
        <FileItem
          key={file}
          name={file}
          path={file}
          isDirectory={false}
          isSelected={selectedFile === file}
          onSelect={() => handleFileSelect(file)}
        />
      ))}

      {/* Components folder */}
      {componentFiles.length > 0 && (
        <FileItem
          name="components"
          path="components"
          isDirectory={true}
          isExpanded={expandedFolders.has('components')}
          onToggle={() => toggleFolder('components')}
        >
          {componentFiles.map(file => (
            <FileItem
              key={file}
              name={file.replace('components/', '')}
              path={file}
              isDirectory={false}
              isSelected={selectedFile === file}
              onSelect={() => handleFileSelect(file)}
            />
          ))}
        </FileItem>
      )}

      {/* Additional folders */}
      {files.filter(file => file.includes('/') && !file.startsWith('components/')).map(file => {
        const folderName = file.split('/')[0];
        if (expandedFolders.has(folderName)) return null;
        
        return (
          <FileItem
            key={folderName}
            name={folderName}
            path={folderName}
            isDirectory={true}
            isExpanded={expandedFolders.has(folderName)}
            onToggle={() => toggleFolder(folderName)}
          />
        );
      })}
    </div>
  );
}
