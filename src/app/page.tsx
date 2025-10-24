'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemHealth, useWebsites } from '@/lib/hooks';
import { LoadingPage } from '@/components/ui/loading';
import { formatRelativeTime } from '@/lib/file-utils';
import { 
  Globe, 
  Lock, 
  TrendingUp, 
  Zap, 
  Activity,
  Eye,
  BarChart3,
  Calendar
} from 'lucide-react';

export default function DashboardPage() {
  const { data: healthData, isLoading: healthLoading } = useSystemHealth();
  const { data: websitesData, isLoading: websitesLoading } = useWebsites(1, 5);

  if (healthLoading || websitesLoading) {
    return <LoadingPage message="Loading dashboard..." />;
  }

  const health = healthData?.data;
  const websites = websitesData?.data?.websites || [];

  const stats = [
    {
      title: 'Total Websites',
      value: health?.stats?.totalWebsites || 0,
      icon: Globe,
      description: 'Websites generated',
      color: 'text-blue-600',
    },
    {
      title: 'Public Websites',
      value: health?.stats?.publicWebsites || 0,
      icon: Eye,
      description: 'Publicly visible',
      color: 'text-green-600',
    },
    {
      title: 'Private Websites',
      value: health?.stats?.privateWebsites || 0,
      icon: Lock,
      description: 'Private websites',
      color: 'text-orange-600',
    },
    {
      title: 'Success Rate',
      value: `${Math.round((health?.stats?.generationSuccessRate || 0) * 100)}%`,
      icon: TrendingUp,
      description: 'Generation success',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your AI website generation activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>System Health</span>
            </CardTitle>
            <CardDescription>
              Current system status and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                health?.status === 'healthy' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {health?.status || 'Unknown'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uptime</span>
              <span className="text-sm text-muted-foreground">
                {health?.uptime ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Memory Usage</span>
              <span className="text-sm text-muted-foreground">
                {health?.memory ? `${health.memory.percentage.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg Generation Time</span>
              <span className="text-sm text-muted-foreground">
                {health?.stats?.averageGenerationTime ? `${health.stats.averageGenerationTime.toFixed(1)}s` : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest website generations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {websites.length > 0 ? (
              <div className="space-y-3">
                {websites.slice(0, 5).map((website) => (
                  <div key={website.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {website.title || 'Untitled Website'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(website.createdAt)}
          </p>
        </div>
                    <div className="flex items-center space-x-2">
                      {website.isPublic ? (
                        <Globe className="w-4 h-4 text-green-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No websites generated yet</p>
                <p className="text-sm">Start by creating your first website!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 rounded-lg border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Generate Website</p>
                <p className="text-sm text-muted-foreground">Create a new website with AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg border">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">View Gallery</p>
                <p className="text-sm text-muted-foreground">Browse all generated websites</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg border">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Recent Activity</p>
                <p className="text-sm text-muted-foreground">View generation history</p>
              </div>
            </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}