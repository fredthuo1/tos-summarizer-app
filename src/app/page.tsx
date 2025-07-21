import TosSummaryTool from '@/app/components/TosSummaryTool';

console.log('✅ Rendering Home page on the server');

export default function Home() {
    return (
        <main>
            <TosSummaryTool />
        </main>
    );
}
