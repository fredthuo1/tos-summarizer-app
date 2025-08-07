import { AnalysisData, CategoryAnalysis } from './analyzer';

// Together AI configuration
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_ENDPOINT = 'https://api.together.xyz/v1/chat/completions';

export async function analyzeWithAI(content: string): Promise<AnalysisData> {
  // Check if Together AI key is available
  if (!TOGETHER_API_KEY) {
    console.warn('Together AI API key not found, using fallback analysis');
    return fallbackAnalysis(content);
  }

  try {
    const prompt = `
You are a legal expert specializing in terms of service and privacy policy analysis. Analyze the following document and provide a comprehensive assessment.

Document to analyze:
${content}

Please provide your analysis in the following JSON format:
{
  "riskLevel": "low|medium|high",
  "score": 0-100,
  "concerns": ["array of specific concerns found"],
  "highlights": ["array of positive aspects found"],
  "summary": "comprehensive summary of the document",
  "categories": {
    "dataPrivacy": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of data privacy implications"
    },
    "userRights": {
      "score": 0-100,
      "riskLevel": "low|medium|high", 
      "findings": ["specific findings for this category"],
      "explanation": "explanation of user rights implications"
    },
    "liability": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of liability implications"
    },
    "termination": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of termination implications"
    },
    "contentOwnership": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of content ownership implications"
    },
    "disputeResolution": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of dispute resolution implications"
    }
  },
  "recommendations": ["array of actionable recommendations"],
  "keyMetrics": {
    "readabilityScore": 0-100,
    "lengthAnalysis": "description of document length",
    "lastUpdated": "extracted date or null",
    "jurisdiction": "extracted jurisdiction or null"
  }
}

Focus on:
1. Data privacy and user information handling
2. User rights including refunds and account control
3. Liability limitations and user responsibilities
4. Account termination conditions
5. Content ownership and licensing
6. Dispute resolution mechanisms

Provide specific, actionable insights that help users understand the real implications of agreeing to these terms.
`;

    const response = await fetch(TOGETHER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-70b-chat-hf',
        messages: [
          {
            role: "system",
            content: "You are a legal expert specializing in terms of service analysis. Provide detailed, accurate analysis in the requested JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Together AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let analysisData;
    try {
      // Try to extract JSON from the response if it's wrapped in text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      analysisData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      throw new Error('AI returned invalid JSON response');
    }
    
    // Validate and ensure all required fields are present
    return validateAnalysisData(analysisData);

  } catch (error) {
    console.error('AI Analysis Error:', error);
    // Fallback to rule-based analysis if AI fails
    return fallbackAnalysis(content);
  }
}

function validateAnalysisData(data: any): AnalysisData {
  // Ensure all required fields are present with defaults
  return {
    riskLevel: data.riskLevel || 'medium',
    score: Math.min(100, Math.max(0, data.score || 50)),
    concerns: Array.isArray(data.concerns) ? data.concerns.slice(0, 8) : [],
    highlights: Array.isArray(data.highlights) ? data.highlights.slice(0, 5) : [],
    summary: data.summary || 'Analysis completed using AI-powered assessment.',
    categories: {
      dataPrivacy: validateCategory(data.categories?.dataPrivacy, 'Data Privacy'),
      userRights: validateCategory(data.categories?.userRights, 'User Rights'),
      liability: validateCategory(data.categories?.liability, 'Liability'),
      termination: validateCategory(data.categories?.termination, 'Termination'),
      contentOwnership: validateCategory(data.categories?.contentOwnership, 'Content Ownership'),
      disputeResolution: validateCategory(data.categories?.disputeResolution, 'Dispute Resolution')
    },
    recommendations: Array.isArray(data.recommendations) ? data.recommendations.slice(0, 5) : [
      'Review the full document carefully',
      'Consider consulting legal advice for high-risk terms',
      'Keep a copy of the terms for your records'
    ],
    keyMetrics: {
      readabilityScore: Math.min(100, Math.max(0, data.keyMetrics?.readabilityScore || 60)),
      lengthAnalysis: data.keyMetrics?.lengthAnalysis || 'Standard length document',
      lastUpdated: data.keyMetrics?.lastUpdated || null,
      jurisdiction: data.keyMetrics?.jurisdiction || null
    }
  };
}

function validateCategory(category: any, categoryName: string): CategoryAnalysis {
  const explanations = {
    'Data Privacy': 'Analyzes how your personal information is collected, used, and protected',
    'User Rights': 'Examines your rights as a user, including refunds, account control, and legal recourse',
    'Liability': 'Reviews who is responsible for damages and what protections exist',
    'Termination': 'Covers how and when your account can be terminated',
    'Content Ownership': 'Determines who owns the content you create or upload',
    'Dispute Resolution': 'Outlines how conflicts between you and the service are resolved'
  };

  return {
    score: Math.min(100, Math.max(0, category?.score || 50)),
    riskLevel: category?.riskLevel || 'medium',
    findings: Array.isArray(category?.findings) ? category.findings.slice(0, 3) : [],
    explanation: category?.explanation || explanations[categoryName as keyof typeof explanations] || ''
  };
}

function fallbackAnalysis(content: string): AnalysisData {
  // Simple fallback analysis if AI fails
  const wordCount = content.trim().split(/\s+/).length;
  const lowerContent = content.toLowerCase();
  
  // Basic risk assessment
  const riskKeywords = ['unlimited liability', 'no refund', 'terminate without cause', 'sell personal data'];
  const riskCount = riskKeywords.filter(keyword => lowerContent.includes(keyword)).length;
  
  const score = Math.min(90, riskCount * 20 + 30);
  const riskLevel = score <= 30 ? 'low' : score <= 60 ? 'medium' : 'high';

  return {
    riskLevel: riskLevel as 'low' | 'medium' | 'high',
    score,
    concerns: riskCount > 0 ? ['Document contains potentially concerning terms'] : [],
    highlights: ['Analysis completed with basic assessment'],
    summary: `This document has been analyzed using fallback analysis. Risk level appears to be ${riskLevel} based on basic keyword detection.`,
    categories: {
      dataPrivacy: { score: 50, riskLevel: 'medium', findings: [], explanation: 'Basic privacy assessment completed' },
      userRights: { score: 50, riskLevel: 'medium', findings: [], explanation: 'Basic user rights assessment completed' },
      liability: { score: 50, riskLevel: 'medium', findings: [], explanation: 'Basic liability assessment completed' },
      termination: { score: 50, riskLevel: 'medium', findings: [], explanation: 'Basic termination assessment completed' },
      contentOwnership: { score: 50, riskLevel: 'medium', findings: [], explanation: 'Basic content ownership assessment completed' },
      disputeResolution: { score: 50, riskLevel: 'medium', findings: [], explanation: 'Basic dispute resolution assessment completed' }
    },
    recommendations: [
      'Consider using AI analysis with proper API key for detailed insights',
      'Review the document manually for specific concerns',
      'Consult legal advice if needed'
    ],
    keyMetrics: {
      readabilityScore: Math.max(0, Math.min(100, 100 - (wordCount / 50))),
      lengthAnalysis: wordCount < 500 ? 'Short document' : wordCount < 2000 ? 'Medium length' : 'Long document',
      lastUpdated: null,
      jurisdiction: null
    }
  };
}