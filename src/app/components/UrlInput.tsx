'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { analyzeContent } from '../lib/analyzer';
import { analyzeWithAI } from '../lib/ai-analyzer';
import { AnalysisResult } from '@/app/page';
import { Loader2, Link, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface UrlInputProps {
  onAnalysis: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export function UrlInput({ onAnalysis, isAnalyzing, setIsAnalyzing }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (starting with http:// or https://)');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      // Simulate fetching content from URL (in real implementation, you'd fetch the actual URL)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockContent = `Terms of Service for ${new URL(url).hostname}
      
      Last Updated: January 15, 2024
      Governing Law: These terms are governed by the laws of Delaware, United States.
      
      1. Acceptance of Terms
      By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. Your continued use constitutes acceptance of any modifications.
      
      2. Privacy Policy
      We collect and use your personal information in accordance with our Privacy Policy. We may share data with partners for marketing purposes and track across websites to improve our services. Data retention is indefinite unless you request deletion.
      
      3. Limitation of Liability
      Under no circumstances shall we be liable for any direct, indirect, incidental, special, consequential, or exemplary damages. Users must indemnify company for any legal costs arising from their use of the service.
      
      4. Data Usage
      We reserve the right to use your data for any purpose, including but not limited to advertising, analytics, and improving our services. We may sell personal data to third parties and users waive class action rights.
      
      5. Account Termination
      We may terminate your account at any time without cause or notice. Upon termination, users forfeit paid fees and cannot transfer account data.
      
      6. Content Rights
      By uploading content, you transfer content rights to us with a perpetual license. We may modify user content as needed for our services.
      
      7. Dispute Resolution
      All disputes must be resolved through mandatory arbitration. Company chooses arbitrator and users waive jury trial rights.`;

      // Use AI-powered analysis
      const analysis = await analyzeWithAI(mockContent);
      
      const result: AnalysisResult = {
        id: Date.now().toString(),
        source: url,
        type: 'url',
        content: mockContent,
        analysis,
        timestamp: new Date()
      };

      onAnalysis(result);
      setUrl('');
    } catch (err) {
      setError('Failed to fetch content from URL. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-sm font-medium">
          Website URL
        </Label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/terms-of-service"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            className="pl-10 h-12 text-base"
            disabled={isAnalyzing}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isAnalyzing || !url.trim()}
        className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing URL...
          </>
        ) : (
          'Analyze URL'
        )}
      </Button>
    </form>
  );
}