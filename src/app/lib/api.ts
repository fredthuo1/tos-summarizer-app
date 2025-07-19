export async function sendAnalysisRequest(
  url: string,
  file: File | null,
  text: string
): Promise<{
  analysis: {
    summary: string;
    red_flags: string[];
    financial_clauses: string[];
    recommendations: string[];
  };
  redacted: string[];
  truncated?: boolean;
}> {
  const formData = new FormData();

  if (url) formData.append('url', url);
  if (file) formData.append('file', file);
  if (text) formData.append('text', text);

  const res = await fetch('/api/summary', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to fetch analysis');
  }

  const data = await res.json();

  return {
    analysis: data.analysis,
    redacted: data.redacted || [],
    truncated: data.truncated || false,
  };
}
