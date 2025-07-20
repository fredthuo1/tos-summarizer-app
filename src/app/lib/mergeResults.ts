type Analysis = {
  summary: string;
  red_flags: string[];
  financial_clauses: string[];
  recommendations: string[];
};

export function mergeResults(results: Analysis[]): Analysis {
  const summary = results.map(r => r.summary).join('\n\n');
  const red_flags = Array.from(new Set(results.flatMap(r => r.red_flags)));
  const financial_clauses = Array.from(new Set(results.flatMap(r => r.financial_clauses)));
  const recommendations = Array.from(new Set(results.flatMap(r => r.recommendations)));

  return {
    summary,
    red_flags,
    financial_clauses,
    recommendations,
  };
}
