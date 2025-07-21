import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
                mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular'],
            },
            colors: {
                'red-flag': '#dc2626',      // dark red for red flags
                'financial': '#ca8a04',     // yellow for financial
                'recommendation': '#15803d' // green for recommendations
            }
        },
    },
    plugins: [],
};

export default config;
