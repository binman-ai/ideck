import { DeckAnalysis, InvestmentScores, AnalysisInsights, ActionableItem } from '../types';
import { config } from '../config';

interface AnalysisRequest {
  deckText: string;
  fileName?: string;
  userId: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class DeckAnalysisService {
  private static instance: DeckAnalysisService;
  private apiKey: string;

  private constructor() {
    this.apiKey = config.openaiApiKey;
  }

  public static getInstance(): DeckAnalysisService {
    if (!DeckAnalysisService.instance) {
      DeckAnalysisService.instance = new DeckAnalysisService();
    }
    return DeckAnalysisService.instance;
  }

  /**
   * Analyze a deck using Indihub's proprietary methodology
   */
  public async analyzeDeck(request: AnalysisRequest): Promise<DeckAnalysis> {
    try {
      const analysisPrompt = this.buildAnalysisPrompt(request.deckText);
      const analysisResult = await this.callOpenAI(analysisPrompt);
      
      const parsedAnalysis = this.parseAnalysisResult(analysisResult);
      
      const analysis: DeckAnalysis = {
        id: this.generateId(),
        userId: request.userId,
        fileName: request.fileName,
        scores: parsedAnalysis.scores,
        insights: parsedAnalysis.insights,
        recommendations: parsedAnalysis.recommendations,
        createdAt: new Date(),
        isPremium: false, // Will be updated based on user subscription
      };

      return analysis;
    } catch (error) {
      console.error('Deck analysis failed:', error);
      throw new Error('Failed to analyze deck. Please try again.');
    }
  }

  /**
   * Build the analysis prompt using Indihub's methodology
   */
  private buildAnalysisPrompt(deckText: string): string {
    return `
You are an expert investor and startup advisor analyzing an investor deck using Indihub's proprietary methodology. 

Analyze the following deck content and provide a comprehensive evaluation based on these 9 key criteria:

1. PROBLEM (0-100): How well does the deck define and validate the problem?
2. SOLUTION (0-100): How compelling and differentiated is the solution?
3. MARKET (0-100): Market size, timing, and opportunity assessment
4. BUSINESS MODEL (0-100): Revenue model clarity and scalability
5. TRACTION (0-100): Evidence of market validation and growth
6. TEAM (0-100): Team composition, experience, and capabilities
7. FINANCIALS (0-100): Financial projections and unit economics
8. COMPETITION (0-100): Competitive analysis and positioning
9. PRESENTATION (0-100): Deck quality, storytelling, and clarity

DECK CONTENT:
${deckText}

Please respond with a JSON object in this exact format:
{
  "scores": {
    "overall": number,
    "problem": number,
    "solution": number,
    "market": number,
    "businessModel": number,
    "traction": number,
    "team": number,
    "financials": number,
    "competition": number,
    "presentation": number
  },
  "insights": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "actionableItems": [
      {
        "category": "problem|solution|market|businessModel|traction|team|financials|competition|presentation",
        "priority": "high|medium|low",
        "description": "specific action item",
        "impact": "expected impact description"
      }
    ],
    "marketAnalysis": "detailed market analysis",
    "competitiveAdvantage": "competitive advantage assessment"
  },
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

Guidelines:
- Be constructive and actionable in feedback
- Focus on investor perspective and what they look for
- Provide specific, measurable recommendations
- Consider Israeli startup ecosystem context when relevant
- Overall score should be weighted average with emphasis on problem, solution, market, and traction
- Include 3-5 actionable items with clear priorities
- Provide 3-5 key recommendations for improvement
`;
  }

  /**
   * Call OpenAI API for analysis
   */
  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert startup advisor and investor with deep knowledge of the Israeli startup ecosystem and Indihub methodology.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Parse the OpenAI analysis result
   */
  private parseAnalysisResult(result: string): {
    scores: InvestmentScores;
    insights: AnalysisInsights;
    recommendations: string[];
  } {
    try {
      // Extract JSON from the response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in analysis result');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the scores
      const scores: InvestmentScores = {
        overall: Math.min(100, Math.max(0, parsed.scores.overall || 0)),
        problem: Math.min(100, Math.max(0, parsed.scores.problem || 0)),
        solution: Math.min(100, Math.max(0, parsed.scores.solution || 0)),
        market: Math.min(100, Math.max(0, parsed.scores.market || 0)),
        businessModel: Math.min(100, Math.max(0, parsed.scores.businessModel || 0)),
        traction: Math.min(100, Math.max(0, parsed.scores.traction || 0)),
        team: Math.min(100, Math.max(0, parsed.scores.team || 0)),
        financials: Math.min(100, Math.max(0, parsed.scores.financials || 0)),
        competition: Math.min(100, Math.max(0, parsed.scores.competition || 0)),
        presentation: Math.min(100, Math.max(0, parsed.scores.presentation || 0)),
      };

      // Calculate overall score if not provided
      if (!scores.overall) {
        scores.overall = Math.round(
          (scores.problem * 0.15 +
           scores.solution * 0.15 +
           scores.market * 0.15 +
           scores.businessModel * 0.12 +
           scores.traction * 0.15 +
           scores.team * 0.10 +
           scores.financials * 0.08 +
           scores.competition * 0.05 +
           scores.presentation * 0.05)
        );
      }

      const insights: AnalysisInsights = {
        strengths: parsed.insights.strengths || [],
        weaknesses: parsed.insights.weaknesses || [],
        actionableItems: (parsed.insights.actionableItems || []).map((item: any) => ({
          category: item.category || 'presentation',
          priority: item.priority || 'medium',
          description: item.description || '',
          impact: item.impact || '',
        })) as ActionableItem[],
        marketAnalysis: parsed.insights.marketAnalysis || '',
        competitiveAdvantage: parsed.insights.competitiveAdvantage || '',
      };

      return {
        scores,
        insights,
        recommendations: parsed.recommendations || [],
      };
    } catch (error) {
      console.error('Failed to parse analysis result:', error);
      throw new Error('Failed to parse analysis result');
    }
  }

  /**
   * Extract text from PDF file
   */
  public async extractTextFromPDF(fileUri: string): Promise<string> {
    try {
      // In a real implementation, you would use a PDF parsing library
      // For now, we'll simulate text extraction
      
      // This would typically use react-native-pdf or similar library
      // For demo purposes, return placeholder text
      return `
        Startup Name: TechCorp
        Problem: Small businesses struggle with inventory management
        Solution: AI-powered inventory optimization platform
        Market: $50B inventory management market
        Business Model: SaaS with tiered pricing
        Traction: 100 customers, $50K MRR
        Team: 3 co-founders with 15+ years experience
        Financials: Projecting $2M ARR by year 2
        Competition: Traditional solutions are outdated
      `;
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get investment readiness level based on overall score
   */
  public getInvestmentReadinessLevel(score: number): {
    level: string;
    description: string;
    color: string;
  } {
    if (score >= 85) {
      return {
        level: 'Investment Ready',
        description: 'Your deck is strong and ready for investor meetings',
        color: '#10B981',
      };
    } else if (score >= 70) {
      return {
        level: 'Nearly Ready',
        description: 'Your deck is good but needs some improvements',
        color: '#F59E0B',
      };
    } else if (score >= 50) {
      return {
        level: 'Needs Work',
        description: 'Your deck requires significant improvements',
        color: '#EF4444',
      };
    } else {
      return {
        level: 'Early Stage',
        description: 'Your deck needs major revisions before approaching investors',
        color: '#EF4444',
      };
    }
  }

  /**
   * Get category-specific recommendations
   */
  public getCategoryRecommendations(category: keyof InvestmentScores, score: number): string[] {
    const recommendations: Record<keyof InvestmentScores, string[]> = {
      overall: [],
      problem: [
        'Quantify the problem with specific data and statistics',
        'Include customer pain points and validation research',
        'Show the urgency and frequency of the problem',
      ],
      solution: [
        'Clearly explain how your solution addresses the problem',
        'Highlight unique features and competitive advantages',
        'Include product demos or screenshots',
      ],
      market: [
        'Provide TAM, SAM, and SOM analysis',
        'Show market growth trends and timing',
        'Include target customer segments and personas',
      ],
      businessModel: [
        'Clarify your revenue streams and pricing strategy',
        'Show unit economics and scalability potential',
        'Include customer acquisition and retention strategies',
      ],
      traction: [
        'Show key metrics and growth trends',
        'Include customer testimonials and case studies',
        'Demonstrate product-market fit evidence',
      ],
      team: [
        'Highlight relevant experience and achievements',
        'Show complementary skills and expertise',
        'Include advisors and key hires',
      ],
      financials: [
        'Provide realistic financial projections',
        'Show key assumptions and drivers',
        'Include funding requirements and use of funds',
      ],
      competition: [
        'Create comprehensive competitive analysis',
        'Show differentiation and positioning',
        'Address competitive threats and barriers',
      ],
      presentation: [
        'Improve visual design and consistency',
        'Enhance storytelling and flow',
        'Reduce text and increase visual elements',
      ],
    };

    return recommendations[category] || [];
  }
}