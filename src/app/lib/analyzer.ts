export interface AnalysisData {
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
  concerns: string[];
  highlights: string[];
  summary: string;
  categories: {
    dataPrivacy: CategoryAnalysis;
    userRights: CategoryAnalysis;
    liability: CategoryAnalysis;
    termination: CategoryAnalysis;
    contentOwnership: CategoryAnalysis;
    disputeResolution: CategoryAnalysis;
  };
  recommendations: string[];
  keyMetrics: {
    readabilityScore: number;
    lengthAnalysis: string;
    lastUpdated: string | null;
    jurisdiction: string | null;
  };
}

export interface CategoryAnalysis {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  findings: string[];
  explanation: string;
}

export function analyzeContent(content: string): AnalysisData {
  const lowerContent = content.toLowerCase();
  const wordCount = content.trim().split(/\s+/).length;
  
  // Enhanced risk factors with categories
  const riskFactors = [
    // Data Privacy Risks
    { keyword: 'sell personal data', weight: 25, category: 'dataPrivacy', description: 'Personal data may be sold to third parties without explicit consent' },
    { keyword: 'share data with partners', weight: 18, category: 'dataPrivacy', description: 'Data sharing with business partners may compromise privacy' },
    { keyword: 'track across websites', weight: 20, category: 'dataPrivacy', description: 'Cross-site tracking may violate privacy expectations' },
    { keyword: 'no data deletion', weight: 22, category: 'dataPrivacy', description: 'Users cannot request deletion of their personal data' },
    { keyword: 'indefinite data retention', weight: 19, category: 'dataPrivacy', description: 'Personal data may be retained indefinitely' },
    
    // User Rights Risks
    { keyword: 'no refund', weight: 15, category: 'userRights', description: 'No refund policy may leave users without recourse' },
    { keyword: 'cannot transfer account', weight: 12, category: 'userRights', description: 'Account portability restrictions limit user freedom' },
    { keyword: 'no data export', weight: 16, category: 'userRights', description: 'Users cannot export their data from the platform' },
    { keyword: 'waive class action', weight: 20, category: 'userRights', description: 'Class action waivers limit collective legal recourse' },
    
    // Liability Risks
    { keyword: 'unlimited liability', weight: 25, category: 'liability', description: 'Unlimited liability clauses expose users to significant financial risk' },
    { keyword: 'indemnify company', weight: 18, category: 'liability', description: 'Users must compensate company for legal costs and damages' },
    { keyword: 'no warranty', weight: 12, category: 'liability', description: 'Service provided without warranties or guarantees' },
    { keyword: 'exclude consequential damages', weight: 15, category: 'liability', description: 'Company excludes liability for indirect damages' },
    
    // Termination Risks
    { keyword: 'terminate without cause', weight: 18, category: 'termination', description: 'Account can be terminated without specific reason' },
    { keyword: 'immediate termination', weight: 16, category: 'termination', description: 'Account termination without advance notice' },
    { keyword: 'forfeit paid fees', weight: 20, category: 'termination', description: 'Users may lose money paid for services upon termination' },
    
    // Content Ownership Risks
    { keyword: 'transfer content rights', weight: 22, category: 'contentOwnership', description: 'Users transfer ownership rights of their content' },
    { keyword: 'perpetual license', weight: 18, category: 'contentOwnership', description: 'Company gains permanent rights to user content' },
    { keyword: 'modify user content', weight: 16, category: 'contentOwnership', description: 'Company can alter user-generated content' },
    
    // Dispute Resolution Risks
    { keyword: 'mandatory arbitration', weight: 17, category: 'disputeResolution', description: 'Disputes must be resolved through arbitration, not courts' },
    { keyword: 'company chooses arbitrator', weight: 20, category: 'disputeResolution', description: 'Company selects the arbitrator, creating potential bias' },
    { keyword: 'waive jury trial', weight: 15, category: 'disputeResolution', description: 'Users give up right to jury trial' }
  ];

  // Enhanced positive factors
  const positiveFactors = [
    // Data Privacy Positives
    { keyword: 'gdpr compliant', weight: 15, category: 'dataPrivacy', description: 'Complies with GDPR data protection standards' },
    { keyword: 'data encryption', weight: 12, category: 'dataPrivacy', description: 'Uses encryption to protect user data' },
    { keyword: 'right to deletion', weight: 18, category: 'dataPrivacy', description: 'Users can request deletion of personal data' },
    { keyword: 'data portability', weight: 16, category: 'dataPrivacy', description: 'Users can export their data' },
    { keyword: 'minimal data collection', weight: 14, category: 'dataPrivacy', description: 'Collects only necessary personal information' },
    
    // User Rights Positives
    { keyword: 'money back guarantee', weight: 20, category: 'userRights', description: 'Offers refunds or money-back guarantees' },
    { keyword: 'account portability', weight: 15, category: 'userRights', description: 'Users can transfer their accounts' },
    { keyword: 'transparent pricing', weight: 10, category: 'userRights', description: 'Clear and transparent pricing structure' },
    
    // Liability Positives
    { keyword: 'limited liability cap', weight: 12, category: 'liability', description: 'Liability is capped at reasonable amounts' },
    { keyword: 'service level agreement', weight: 14, category: 'liability', description: 'Provides service level commitments' },
    
    // Termination Positives
    { keyword: 'advance notice', weight: 16, category: 'termination', description: 'Provides advance notice before termination' },
    { keyword: 'grace period', weight: 14, category: 'termination', description: 'Offers grace period for account issues' },
    
    // Content Ownership Positives
    { keyword: 'retain content ownership', weight: 18, category: 'contentOwnership', description: 'Users retain ownership of their content' },
    { keyword: 'revocable license', weight: 15, category: 'contentOwnership', description: 'License to user content can be revoked' },
    
    // Dispute Resolution Positives
    { keyword: 'neutral arbitration', weight: 12, category: 'disputeResolution', description: 'Uses neutral arbitration services' },
    { keyword: 'court jurisdiction option', weight: 16, category: 'disputeResolution', description: 'Allows court proceedings as alternative' }
  ];

  // Initialize category scores
  const categoryScores = {
    dataPrivacy: { risk: 0, positive: 0, findings: [] as string[] },
    userRights: { risk: 0, positive: 0, findings: [] as string[] },
    liability: { risk: 0, positive: 0, findings: [] as string[] },
    termination: { risk: 0, positive: 0, findings: [] as string[] },
    contentOwnership: { risk: 0, positive: 0, findings: [] as string[] },
    disputeResolution: { risk: 0, positive: 0, findings: [] as string[] }
  };

  let totalRiskScore = 0;
  let totalPositiveScore = 0;
  const foundConcerns: string[] = [];
  const foundHighlights: string[] = [];

  // Analyze risk factors
  riskFactors.forEach(factor => {
    if (lowerContent.includes(factor.keyword)) {
      totalRiskScore += factor.weight;
      foundConcerns.push(factor.description);
      categoryScores[factor.category as keyof typeof categoryScores].risk += factor.weight;
      categoryScores[factor.category as keyof typeof categoryScores].findings.push(factor.description);
    }
  });

  // Analyze positive factors
  positiveFactors.forEach(factor => {
    if (lowerContent.includes(factor.keyword)) {
      totalPositiveScore += factor.weight;
      foundHighlights.push(factor.description);
      categoryScores[factor.category as keyof typeof categoryScores].positive += factor.weight;
      categoryScores[factor.category as keyof typeof categoryScores].findings.push(factor.description);
    }
  });

  // Calculate category analyses
  const categories = {
    dataPrivacy: analyzeCategoryScore(categoryScores.dataPrivacy, 'Data Privacy'),
    userRights: analyzeCategoryScore(categoryScores.userRights, 'User Rights'),
    liability: analyzeCategoryScore(categoryScores.liability, 'Liability'),
    termination: analyzeCategoryScore(categoryScores.termination, 'Termination'),
    contentOwnership: analyzeCategoryScore(categoryScores.contentOwnership, 'Content Ownership'),
    disputeResolution: analyzeCategoryScore(categoryScores.disputeResolution, 'Dispute Resolution')
  };

  // Calculate overall score
  const baseScore = Math.min(totalRiskScore, 90);
  const adjustedScore = Math.max(0, baseScore - totalPositiveScore / 3);
  const finalScore = Math.round(adjustedScore);

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high';
  if (finalScore <= 25) {
    riskLevel = 'low';
  } else if (finalScore <= 55) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  // Calculate readability score (simplified)
  const avgWordsPerSentence = wordCount / Math.max(content.split(/[.!?]+/).length - 1, 1);
  const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));

  // Generate recommendations
  const recommendations = generateRecommendations(categories, riskLevel, foundConcerns);

  // Analyze document length
  const getLengthAnalysis = (words: number): string => {
    if (words < 500) return 'Very Short - May lack important details';
    if (words < 1500) return 'Short - Covers basic terms';
    if (words < 3000) return 'Medium - Comprehensive coverage';
    if (words < 5000) return 'Long - Detailed terms';
    return 'Very Long - Extensive legal document';
  };

  // Extract potential jurisdiction (simplified)
  const extractJurisdiction = (content: string): string | null => {
    const jurisdictionPatterns = [
      /governed by.*laws of ([^,.\n]+)/i,
      /jurisdiction of ([^,.\n]+)/i,
      /courts of ([^,.\n]+)/i
    ];
    
    for (const pattern of jurisdictionPatterns) {
      const match = content.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };

  return {
    riskLevel,
    score: finalScore,
    concerns: foundConcerns.slice(0, 8),
    highlights: foundHighlights.slice(0, 5),
    summary: generateEnhancedSummary(riskLevel, foundConcerns.length, foundHighlights.length, categories),
    categories,
    recommendations,
    keyMetrics: {
      readabilityScore: Math.round(readabilityScore),
      lengthAnalysis: getLengthAnalysis(wordCount),
      lastUpdated: extractLastUpdated(content),
      jurisdiction: extractJurisdiction(content)
    }
  };
}

function analyzeCategoryScore(categoryData: any, categoryName: string): CategoryAnalysis {
  const netScore = Math.max(0, categoryData.risk - categoryData.positive / 2);
  const normalizedScore = Math.min(100, netScore * 2);
  
  let riskLevel: 'low' | 'medium' | 'high';
  if (normalizedScore <= 30) riskLevel = 'low';
  else if (normalizedScore <= 60) riskLevel = 'medium';
  else riskLevel = 'high';

  const explanations = {
    'Data Privacy': 'Analyzes how your personal information is collected, used, and protected',
    'User Rights': 'Examines your rights as a user, including refunds, account control, and legal recourse',
    'Liability': 'Reviews who is responsible for damages and what protections exist',
    'Termination': 'Covers how and when your account can be terminated',
    'Content Ownership': 'Determines who owns the content you create or upload',
    'Dispute Resolution': 'Outlines how conflicts between you and the service are resolved'
  };

  return {
    score: Math.round(normalizedScore),
    riskLevel,
    findings: categoryData.findings.slice(0, 3),
    explanation: explanations[categoryName as keyof typeof explanations] || ''
  };
}

function generateRecommendations(categories: any, riskLevel: string, concerns: string[]): string[] {
  const recommendations: string[] = [];

  if (riskLevel === 'high') {
    recommendations.push('Consider seeking legal advice before accepting these terms');
    recommendations.push('Look for alternative services with more user-friendly terms');
  }

  if (categories.dataPrivacy.riskLevel === 'high') {
    recommendations.push('Review the privacy policy carefully and consider data protection implications');
    recommendations.push('Check if you can opt-out of data sharing practices');
  }

  if (categories.liability.riskLevel === 'high') {
    recommendations.push('Consider additional insurance or protection for potential liabilities');
  }

  if (categories.termination.riskLevel === 'high') {
    recommendations.push('Backup your data regularly in case of sudden account termination');
  }

  if (categories.disputeResolution.riskLevel === 'high') {
    recommendations.push('Understand your legal options are limited by arbitration clauses');
  }

  if (recommendations.length === 0) {
    recommendations.push('The terms appear reasonable, but always read the full document');
    recommendations.push('Keep a copy of the terms for your records');
  }

  return recommendations.slice(0, 5);
}

function generateEnhancedSummary(riskLevel: string, concernCount: number, highlightCount: number, categories: any): string {
  const highRiskCategories = Object.entries(categories)
    .filter(([_, cat]: [string, any]) => cat.riskLevel === 'high')
    .map(([name, _]) => name.replace(/([A-Z])/g, ' $1').toLowerCase());

  if (riskLevel === 'low') {
    return `This document appears user-friendly with ${concernCount} concerns identified across ${Object.keys(categories).length} categories. ${highlightCount > 0 ? `It includes ${highlightCount} positive user protections. ` : ''}The terms seem balanced and reasonable for most users.`;
  } else if (riskLevel === 'medium') {
    return `This document presents moderate risks with ${concernCount} concerns identified. ${highRiskCategories.length > 0 ? `Pay special attention to ${highRiskCategories.join(', ')} sections. ` : ''}${highlightCount > 0 ? `It does include ${highlightCount} positive aspects. ` : ''}Review carefully and consider the trade-offs.`;
  } else {
    return `This document presents significant risks with ${concernCount} major concerns. ${highRiskCategories.length > 0 ? `Critical issues found in ${highRiskCategories.join(', ')} areas. ` : ''}${highlightCount === 0 ? 'It lacks adequate user protections and ' : 'Despite some positive aspects, it '}heavily favors the service provider. Proceed with extreme caution.`;
  }
}

function extractLastUpdated(content: string): string | null {
  const datePatterns = [
    /last updated:?\s*([^.\n]+)/i,
    /effective date:?\s*([^.\n]+)/i,
    /updated on:?\s*([^.\n]+)/i
  ];
  
  for (const pattern of datePatterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}