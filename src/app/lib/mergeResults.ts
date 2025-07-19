export function mergeResults(results: any[]) {
  const dedupe = (arr: string[]) => [...new Set(arr)];

  return {
    summary: results.map(r => r.summary).join(' '),
    red_flags: dedupe(results.flatMap(r => r.red_flags || [])),
    financial_clauses: dedupe(results.flatMap(r => r.financial_clauses || [])),
    recommendations: dedupe(results.flatMap(r => r.recommendations || [])),
  };
}
