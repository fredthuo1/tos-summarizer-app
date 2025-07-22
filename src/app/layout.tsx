// 🚫 DO NOT add `use client` here!
import './globals.css';
import React from 'react';

export const metadata = {
    title: '📄 Terms of Service Analyzer',
    description: 'Analyze Terms of Service documents with AI',
    openGraph: {
        title: '📄 Terms of Service Analyzer',
        description: 'Analyze Terms of Service documents with AI',
        type: 'website',
        url: 'https://termsreviewer.com/',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
