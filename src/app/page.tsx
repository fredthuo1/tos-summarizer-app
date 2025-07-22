'use client';

import Script from 'next/script';
import TosSummaryTool from '../app/components/TosSummaryTool';

export default function HomePage() {
    return (
        <>
            <Script
                id="adsbygoogle-init"
                async
                strategy="afterInteractive"
                crossOrigin="anonymous"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588865009381819"
            />
            <TosSummaryTool />
        </>
    );
}
