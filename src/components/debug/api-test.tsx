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
      const result = await api.getSystemHealth();
      setTestResult(`✅ API Connected!\nStatus: ${result.data.status}\nUptime: ${result.data.uptime}s\nDatabase: ${result.data.services?.database}\nAI: ${result.data.services?.ai}`);
    } catch (error: any) {
      setTestResult(`❌ API Error:\n${error.message}\n\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`);
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
