// Application constants
export const APP_CONFIG = {
  name: 'Terms Analyzer',
  description: 'AI-Powered Terms of Service Analysis',
  version: '1.0.0',
  author: 'Terms Analyzer Team',
  url: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000',
};

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
};

// Analysis Configuration
export const ANALYSIS_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedFileTypes: [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  minTextLength: 50,
  maxTextLength: 100000, // 100KB
};

// UI Configuration
export const UI_CONFIG = {
  animationDuration: 200,
  toastDuration: 5000,
  debounceDelay: 300,
};