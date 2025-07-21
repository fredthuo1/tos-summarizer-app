import './globals.css';

export const metadata = {
    title: 'ToS Summarizer',
    description: 'Analyze Terms of Service documents with AI',
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
