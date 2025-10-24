'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export function APITest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    setTestResult('Testing API connection...');
    
    try {
      // Test both endpoints
      const [healthResult, websitesResult] = await Promise.allSettled([
        api.getSystemHealth(),
        api.getWebsites(1, 5)
      ]);
      
      let resultText = '';
      
      // Health check result
      if (healthResult.status === 'fulfilled' && healthResult.value?.data) {
        const health = healthResult.value.data;
        resultText += `✅ Health API: ${health.status}\nUptime: ${health.uptime}s\nDatabase: ${health.services?.database || 'unknown'}\nAI: ${health.services?.ai || 'unknown'}\n\n`;
      } else {
        resultText += `❌ Health API failed: ${healthResult.status === 'rejected' ? healthResult.reason?.message : 'No data'}\n\n`;
      }
      
      // Websites result
      if (websitesResult.status === 'fulfilled' && websitesResult.value?.data) {
        const websites = websitesResult.value.data;
        resultText += `✅ Websites API: ${websites.websites?.length || 0} websites found\nTotal: ${websites.total || 0}\n`;
      } else {
        resultText += `❌ Websites API failed: ${websitesResult.status === 'rejected' ? websitesResult.reason?.message : 'No data'}\n`;
      }
      
      setTestResult(resultText);
      
    } catch (error: any) {
      console.error('API Test Error:', error);
      setTestResult(`❌ API Error:\nMessage: ${error.message}\nCode: ${error.code}\nStatus: ${error.response?.status}\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testAPI} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </Button>
        
        {testResult && (
          <div className="p-4 bg-muted rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'https://mini-website-ai-builder-production.up.railway.app/api/v1'}</p>
          <p><strong>Expected:</strong> Status 200, Database healthy, AI service available</p>
        </div>
      </CardContent>
    </Card>
  );
}
