// next-seo.config.ts
const defaultSEO = {
    title: 'Terms of Service Analyzer',
    description: 'Analyze Terms of Service documents with AI-powered insights: red flags, financial clauses, and recommendations.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://termsreviewer.com/',
        site_name: 'Terms of Service Analyzer',
        images: [
            {
                url: 'https://termsreviewer.com/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Terms of Service Analyzer',
            },
        ],
    },
    twitter: {
        handle: '@yourhandle',
        site: '@yourhandle',
        cardType: 'summary_large_image',
    },
};

export default defaultSEO;
