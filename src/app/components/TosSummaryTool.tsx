'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { sendAnalysisRequest } from '../lib/api';

type Analysis = {
  summary: string;
  red_flags: string[];
  financial_clauses: string[];
  recommendations: string[];
};

export default function TosSummaryTool() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState('');
  const [redacted, setRedacted] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // 🔷 Load dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 🔷 Sync dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis(null);
    setTruncated(false);
    setRedacted([]);
    toast.info('🔍 Analyzing document…');

    try {
      const result = await sendAnalysisRequest(url, file, text);
      setAnalysis(result.analysis);
      setTruncated(result.truncated || false);
      setRedacted(result.redacted || []);
      toast.success('✅ Analysis completed!');
    } catch {
      setError('Something went wrong. Please try again.');
      toast.error('❌ Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetInputs = () => {
    setUrl('');
    setFile(null);
    setText('');
    setAnalysis(null);
    setError('');
    setTruncated(false);
    setRedacted([]);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {/* Top Banner */}
      <div className="bg-blue-100 dark:bg-blue-800 text-center py-2 text-sm text-blue-800 dark:text-blue-100 font-medium flex justify-between px-4">
        📢 Terms of Service Analyzer
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xs text-blue-800 dark:text-blue-100 underline"
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div className="flex flex-1">
        {/* Left Ad */}
        <div className="hidden lg:flex lg:flex-col w-32 bg-blue-50 dark:bg-blue-900 p-2 justify-center items-center text-xs text-blue-600 dark:text-blue-200">
          Left Ad
        </div>

        <main className="flex-1 p-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 space-y-6"
          >
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
              📄 Terms of Service Analyzer
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
              Paste text, enter a URL, or upload a file — get an AI-powered analysis.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="url"
                placeholder="Enter URL (optional)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border rounded-md w-full p-2 text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Or paste the Terms & Conditions text here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                className="border rounded-md w-full p-2 text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex items-center gap-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 dark:text-blue-300 hover:underline text-sm"
                >
                  {file?.name || 'Upload a file (.txt, .pdf, .docx, .html)'}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.pdf,.docx,.html"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium"
                >
                  {loading ? 'Analyzing…' : 'Analyze'}
                </button>

                <button
                  type="button"
                  onClick={resetInputs}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 py-2 rounded-md text-sm"
                >
                  Reset
                </button>
              </div>
            </form>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-red-600 text-sm"
                >
                  {error}
                </motion.p>
              )}

              {truncated && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-yellow-600 text-sm"
                >
                  ⚠️ Document was too long — analysis may not cover everything.
                </motion.p>
              )}
            </AnimatePresence>

            {redacted.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600"
              >
                <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  🔒 Redacted Information:
                </h2>
                <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-300 space-y-1">
                  {redacted.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {analysis && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4">
                  <h2 className="font-semibold text-gray-700 dark:text-gray-200">Summary:</h2>
                  <p className="text-sm text-gray-800 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                    {analysis.summary || 'No summary provided.'}
                  </p>
                </div>

                <div className="bg-red-100 dark:bg-red-800 rounded-md p-4">
                  <h2 className="font-semibold text-red-700 dark:text-red-200">Red Flags:</h2>
                  <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-100 space-y-1 mt-1">
                    {(analysis.red_flags?.length
                      ? analysis.red_flags
                      : ['No red flags detected.']
                    ).map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-100 dark:bg-yellow-700 rounded-md p-4">
                  <h2 className="font-semibold text-yellow-700 dark:text-yellow-200">Financial Clauses:</h2>
                  <ul className="list-disc list-inside text-sm text-yellow-800 dark:text-yellow-100 space-y-1 mt-1">
                    {(analysis.financial_clauses?.length
                      ? analysis.financial_clauses
                      : ['No financial clauses detected.']
                    ).map((clause, idx) => (
                      <li key={idx}>{clause}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-100 dark:bg-green-800 rounded-md p-4">
                  <h2 className="font-semibold text-green-700 dark:text-green-200">Recommendations:</h2>
                  <ul className="list-disc list-inside text-sm text-green-800 dark:text-green-100 space-y-1 mt-1">
                    {(analysis.recommendations?.length
                      ? analysis.recommendations
                      : ['No recommendations provided.']
                    ).map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>

        {/* Right Ad */}
        <div className="hidden lg:flex lg:flex-col w-32 bg-blue-50 dark:bg-blue-900 p-2 justify-center items-center text-xs text-blue-600 dark:text-blue-200">
          Right Ad
        </div>
      </div>

      <div className="bg-blue-100 dark:bg-blue-800 text-center py-2 text-sm text-blue-800 dark:text-blue-100">
        📢 Bottom Banner Ad
      </div>
    </div>
  );
}
