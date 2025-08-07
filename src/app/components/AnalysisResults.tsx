'use client';

import { AnalysisResult } from '@/app/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, AlertTriangle, CheckCircle, Download, Calendar, ExternalLink, FileText, Users, Scale, XCircle, Gavel, BookOpen, TrendingUp, Clock, MapPin, Eye } from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      dataPrivacy: <Shield className="h-5 w-5" />,
      userRights: <Users className="h-5 w-5" />,
      liability: <Scale className="h-5 w-5" />,
      termination: <XCircle className="h-5 w-5" />,
      contentOwnership: <FileText className="h-5 w-5" />,
      disputeResolution: <Gavel className="h-5 w-5" />
    };
    return icons[category as keyof typeof icons] || <BookOpen className="h-5 w-5" />;
  };

  const getCategoryName = (category: string) => {
    const names = {
      dataPrivacy: 'Data Privacy',
      userRights: 'User Rights',
      liability: 'Liability',
      termination: 'Termination',
      contentOwnership: 'Content Ownership',
      disputeResolution: 'Dispute Resolution'
    };
    return names[category as keyof typeof names] || category;
  };

  const handleExport = (result: AnalysisResult) => {
    const exportData = {
      source: result.source,
      type: result.type,
      timestamp: result.timestamp,
      analysis: result.analysis
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terms-analysis-${result.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h2>
        <p className="text-gray-600">Comprehensive insights from your terms of service documents</p>
      </div>

      <div className="grid gap-8">
        {results.map((result, index) => (
          <div key={result.id} className="space-y-4">
            {index === 1 && <AdSenseUnit slot="results-middle" format="horizontal" />}
            
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {result.type.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs border ${getRiskColor(result.analysis.riskLevel)}`}>
                        {getRiskIcon(result.analysis.riskLevel)}
                        <span className="ml-1">{result.analysis.riskLevel.toUpperCase()} RISK</span>
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Score: {result.analysis.score}/100
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-1">
                      {result.type === 'url' ? (
                        <div className="flex items-center space-x-2">
                          <span className="truncate">{result.source}</span>
                          <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                      ) : (
                        result.source
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(result)}
                    className="ml-4"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Risk Score */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Overall Risk Score
                        </span>
                        <span className="text-sm font-bold">{result.analysis.score}/100</span>
                      </div>
                      <Progress 
                        value={result.analysis.score} 
                        className={`h-3 ${
                          result.analysis.score <= 30 ? 'text-green-600' :
                          result.analysis.score <= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {result.analysis.score <= 30 ? 'Low risk - Generally user-friendly terms' :
                         result.analysis.score <= 60 ? 'Medium risk - Review carefully before accepting' :
                         'High risk - Consider alternatives or seek legal advice'}
                      </p>
                    </div>

                    {/* Summary */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Executive Summary
                      </h4>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {result.analysis.summary}
                      </p>
                    </div>

                    {/* Key Concerns */}
                    {result.analysis.concerns.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                          Key Concerns ({result.analysis.concerns.length})
                        </h4>
                        <div className="grid gap-2">
                          {result.analysis.concerns.map((concern, idx) => (
                            <div key={idx} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-orange-800">{concern}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Positive Highlights */}
                    {result.analysis.highlights.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Positive Aspects ({result.analysis.highlights.length})
                        </h4>
                        <div className="grid gap-2">
                          {result.analysis.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-green-800">{highlight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="categories" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(result.analysis.categories).map(([key, category]) => (
                        <Card key={key} className="border-2">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(key)}
                                <CardTitle className="text-base">{getCategoryName(key)}</CardTitle>
                              </div>
                              <Badge className={`text-xs ${getRiskColor(category.riskLevel)}`}>
                                {category.riskLevel.toUpperCase()}
                              </Badge>
                            </div>
                            <CardDescription className="text-xs">
                              {category.explanation}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="mb-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Risk Level</span>
                                <span className="text-xs font-bold">{category.score}/100</span>
                              </div>
                              <Progress value={category.score} className="h-2" />
                            </div>
                            {category.findings.length > 0 && (
                              <div>
                                <p className="text-xs font-medium mb-2">Key Findings:</p>
                                <div className="space-y-1">
                                  {category.findings.map((finding, idx) => (
                                    <p key={idx} className="text-xs text-gray-600 flex items-start">
                                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                                      {finding}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Recommendations
                      </h4>
                      <div className="space-y-3">
                        {result.analysis.recommendations.map((recommendation, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-blue-600 font-semibold text-xs">{idx + 1}</span>
                            </div>
                            <p className="text-sm text-blue-800">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Readability
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Readability Score</span>
                            <span className="font-bold">{result.analysis.keyMetrics.readabilityScore}/100</span>
                          </div>
                          <Progress value={result.analysis.keyMetrics.readabilityScore} className="h-2 mb-2" />
                          <p className="text-xs text-gray-600">
                            {result.analysis.keyMetrics.readabilityScore >= 70 ? 'Easy to read' :
                             result.analysis.keyMetrics.readabilityScore >= 50 ? 'Moderately complex' :
                             'Difficult to read'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Document Info
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Length</span>
                            <span className="text-sm font-medium">{result.analysis.keyMetrics.lengthAnalysis}</span>
                          </div>
                          {result.analysis.keyMetrics.lastUpdated && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Last Updated
                              </span>
                              <span className="text-sm font-medium">{result.analysis.keyMetrics.lastUpdated}</span>
                            </div>
                          )}
                          {result.analysis.keyMetrics.jurisdiction && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                Jurisdiction
                              </span>
                              <span className="text-sm font-medium">{result.analysis.keyMetrics.jurisdiction}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}