import './globals.css';
import Script from 'next/script';
import React from 'react';

export const metadata = {
    title: '📄 Terms of Service Analyzer',
    description: 'Analyze Terms of Service documents with AI',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head> 
                <Script
                    id="adsbygoogle-init"
                    async
                    strategy="afterInteractive"
                    crossOrigin="anonymous"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588865009381819"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}