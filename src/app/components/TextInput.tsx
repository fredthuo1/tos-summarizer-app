'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { analyzeContent } from '../lib/analyzer';
import { analyzeWithAI } from '../lib/ai-analyzer';
import { AnalysisResult } from '@/app/page';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface TextInputProps {
  onAnalysis: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export function TextInput({ onAnalysis, isAnalyzing, setIsAnalyzing }: TextInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }
    
    if (text.trim().length < 50) {
      setError('Please enter at least 50 characters for meaningful analysis');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      // Show processing indicator
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Enhance the text with some context for better analysis
      const enhancedText = text.includes('last updated') ? text : 
        `Last Updated: ${new Date().toLocaleDateString()}\n\n${text}`;
      
      // Use AI-powered analysis
      const analysis = await analyzeWithAI(enhancedText);
      
      const result: AnalysisResult = {
        id: Date.now().toString(),
        source: 'Direct Text Input',
        type: 'text',
        content: enhancedText,
        analysis,
        timestamp: new Date()
      };

      onAnalysis(result);
      setText('');
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text" className="text-sm font-medium">
          Terms of Service Text
        </Label>
        <Textarea
          id="text"
          placeholder="Paste your terms of service or privacy policy text here..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          className="min-h-[200px] text-base resize-none"
          disabled={isAnalyzing}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{characterCount} characters</span>
          <span>{wordCount} words</span>
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
        disabled={isAnalyzing || !text.trim() || text.trim().length < 50}
        className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Text...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Analyze Text
          </>
        )}
      </Button>
    </form>
  );
}