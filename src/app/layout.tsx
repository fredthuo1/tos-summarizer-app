import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Terms Analyzer - AI-Powered Terms of Service Analysis',
    description: 'Analyze terms of service and privacy policies with AI-powered insights. Upload documents, paste text, or analyze websites instantly.',
    keywords: 'terms of service, privacy policy, legal analysis, AI analysis, document analysis',
    authors: [{ name: 'Terms Analyzer' }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    openGraph: {
        title: 'Terms Analyzer - AI-Powered Terms of Service Analysis',
        description: 'Analyze terms of service and privacy policies with AI-powered insights. Upload documents, paste text, or analyze websites instantly.',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms Analyzer - AI-Powered Terms of Service Analysis',
        description: 'Analyze terms of service and privacy policies with AI-powered insights.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* Google AdSense */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </head>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </ThemeProvider>
            </body>
        </html>
    );
}