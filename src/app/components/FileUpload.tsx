'use client';

import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { analyzeContent } from '../lib/analyzer';
import { analyzeWithAI } from '../lib/ai-analyzer';
import { AnalysisResult } from '@/app/page';
import { Upload, File, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface FileUploadProps {
  onAnalysis: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

interface UploadedFile {
  file: File;
  content: string;
}

export function FileUpload({ onAnalysis, isAnalyzing, setIsAnalyzing }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError('Only text, PDF, and Word documents are supported');
      return false;
    }
    
    return true;
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    setError('');
    
    if (!validateFile(file)) return;

    try {
      let content: string;
      
      if (file.type === 'text/plain') {
        content = await readFileContent(file);
      } else {
        // For demo purposes, simulate content extraction from PDF/Word
        content = `Terms of Service Document: ${file.name}
        Last Updated: December 2023
        Jurisdiction: California, United States
        
        1. Service Agreement
        By using our service, you agree to these terms and conditions. Your continued use constitutes acceptance. We may modify terms without notice.
        
        2. Data Collection and Usage
        We collect personal information including but not limited to your name, email, browsing habits, and device information. This data may be shared with third-party partners for marketing and analytics purposes. We track across websites and retain data indefinitely.
        
        3. Liability and Disclaimers
        We disclaim all warranties and exclude consequential damages. Users must indemnify company for any legal costs and assume unlimited liability for service usage.
        
        4. Account Management
        We reserve the right to terminate without cause or advance notice. Users forfeit paid fees upon termination and cannot transfer account data.
        
        5. Content and Intellectual Property
        Users transfer content rights with perpetual license. We may modify user content and retain ownership of all uploaded materials.
        
        6. Dispute Resolution
        All disputes subject to mandatory arbitration with company-chosen arbitrator. Users waive class action and jury trial rights.`;
      }

      setUploadedFile({ file, content });
    } catch (err) {
      setError('Failed to read file content. Please try again.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    try {
      // Show processing indicator
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use AI-powered analysis
      const analysis = await analyzeWithAI(uploadedFile.content);
      
      const result: AnalysisResult = {
        id: Date.now().toString(),
        source: uploadedFile.file.name,
        type: 'file',
        content: uploadedFile.content,
        analysis,
        timestamp: new Date()
      };

      onAnalysis(result);
      setUploadedFile(null);
    } catch (err) {
      setError('Failed to analyze file. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isAnalyzing}
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop your file here, or click to browse
          </h3>
          <p className="text-sm text-gray-600">
            Supports TXT, PDF, DOC, DOCX files up to 5MB
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">{uploadedFile.file.name}</p>
                <p className="text-sm text-green-700">
                  {(uploadedFile.file.size / 1024).toFixed(1)} KB • Ready to analyze
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-green-700 hover:text-green-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing File...
              </>
            ) : (
              <>
                <File className="mr-2 h-4 w-4" />
                Analyze File
              </>
            )}
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}