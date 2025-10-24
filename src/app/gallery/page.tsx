'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebsites } from '@/lib/hooks';
import { Website } from '@/lib/api';
import { LoadingCard } from '@/components/ui/loading';
import { formatRelativeTime, generatePreviewThumbnail } from '@/lib/file-utils';
import { FrameworkBadges } from '@/components/ui/framework-badges';
import { 
  Grid3X3, 
  List, 
  Search, 
  Eye, 
  Globe, 
  Lock, 
  Calendar,
  MoreHorizontal,
  Download,
  Copy,
  Trash2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery, setSearchQuery, filterPublic, setFilterPublic } = useAppStore();

  const { data, isLoading, error } = useWebsites(currentPage, 12, searchQuery);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">Website Gallery</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold gradient-text mb-4">Website Gallery</h1>
        <p className="text-muted-foreground">Failed to load websites. Please try again.</p>
      </div>
    );
  }

  // Try different data structures
  const websites: Website[] = (data as any)?.data?.websites || (data as any)?.data || (data as any)?.websites || [];
  const totalPages = (data as any)?.data?.totalPages || (data as any)?.totalPages || 1;

  // Debug logging
  console.log('Gallery Debug:', {
    data,
    websites,
    totalPages,
    dataStructure: data?.data,
    dataKeys: data ? Object.keys(data) : [],
    dataDataKeys: data?.data ? Object.keys(data.data) : []
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    if (value === 'all') {
      setFilterPublic(null);
    } else if (value === 'public') {
      setFilterPublic(true);
    } else {
      setFilterPublic(false);
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Website Gallery</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search websites..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterPublic === null ? 'all' : filterPublic ? 'public' : 'private'} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Websites</SelectItem>
            <SelectItem value="public">Public Only</SelectItem>
            <SelectItem value="private">Private Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {data?.data?.total || 0} website{data?.data?.total !== 1 ? 's' : ''} found
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Websites Grid/List */}
      {websites.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {websites.map((website) => (
            <Card key={website.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {website.title || 'Untitled Website'}
                    </CardTitle>
                    <CardDescription className="truncate">
                      {website.description || 'No description'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {website.isPublic ? (
                      <Globe className="w-4 h-4 text-green-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-orange-600" />
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/preview/${website.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy HTML
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview Thumbnail */}
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={generatePreviewThumbnail(website.htmlContent)}
                    alt={website.title || 'Website preview'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Framework Badges */}
                <FrameworkBadges metadata={website.metadata} />

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatRelativeTime(website.createdAt)}</span>
                  </div>
                  {website.metadata?.category && (
                    <span className="px-2 py-1 bg-muted rounded-full text-xs">
                      {website.metadata.category}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href={`/preview/${website.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No websites found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterPublic !== null
              ? 'Try adjusting your search or filter criteria'
              : 'Start by generating your first website'}
          </p>
          {!searchQuery && filterPublic === null && (
            <Button asChild>
              <Link href="/generate">Generate Website</Link>
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
