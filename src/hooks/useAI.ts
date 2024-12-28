import { useCallback } from 'react';
import { SentimentAnalyzer, WordTokenizer, PorterStemmer } from 'natural';
import { CompanyRecord } from '../types/index.js';

interface AIAnalysis {
  sentiment: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
  };
  keywords: string[];
  summary: string;
}

export const useAI = () => {
  // Sentiment Analysis
  const analyzeSentiment = useCallback((text: string) => {
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const tokenizer = new WordTokenizer();
    const tokens = tokenizer.tokenize(text);
    const score = analyzer.getSentiment(tokens);

    return {
      score,
      label: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
    };
  }, []);

  // Company Similarity Analysis
  const findSimilarCompanies = useCallback(
    (company: CompanyRecord, allCompanies: CompanyRecord[]): CompanyRecord[] => {
      const companyTags = new Set([...company.category, ...company.tags]);

      return allCompanies
        .filter((c) => c.id !== company.id)
        .map((c) => {
          const otherTags = new Set([...c.category, ...c.tags]);
          const intersection = new Set(
            [...companyTags].filter((x) => otherTags.has(x))
          );
          const similarity =
            intersection.size / Math.max(companyTags.size, otherTags.size);
          return { ...c, similarity };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
    },
    []
  );

  // Market Trend Analysis
  const analyzeMarketTrends = useCallback((companies: CompanyRecord[]) => {
    const categoryCounts = companies.reduce(
      (acc: { [key: string]: number }, company) => {
        company.category.forEach((cat: string) => {
          acc[cat] = (acc[cat] || 0) + 1;
        });
        return acc;
      },
      {}
    );

    const topCategories = Object.entries(categoryCounts)
      .map(([cat, count]: [string, number]): [string, number] => [cat, count])
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      dominantCategories: topCategories,
      totalCompanies: companies.length,
      categoryDistribution: Object.fromEntries(
        topCategories.map(([cat, count]) => [
          cat,
          (count / companies.length) * 100,
        ])
      ) as { [key: string]: number },
    };
  }, []);

  // Anomaly Detection
  const detectAnomalies = useCallback((company: CompanyRecord) => {
    const anomalies: string[] = [];

    // Check for incomplete data
    if (!company.description || company.description.length < 50) {
      anomalies.push('Insufficient company description');
    }

    if (!company.ceo) {
      anomalies.push('Missing CEO information');
    }

    if (!company.socialMedia?.linkedin && !company.socialMedia?.twitter) {
      anomalies.push('No social media presence');
    }

    // Check for unusual patterns
    if (company.category.length > 10) {
      anomalies.push('Unusually high number of categories');
    }

    return anomalies;
  }, []);

  // Competitive Analysis
  const analyzeCompetitiveLandscape = useCallback(
    (company: CompanyRecord, competitors: CompanyRecord[]) => {
      const analysis = {
        marketPosition: '',
        strengths: [] as string[],
        weaknesses: [] as string[],
        opportunities: [] as string[],
      };

      // Analyze market position
      const competitorCount = competitors.length;
      if (competitorCount > 10) {
        analysis.marketPosition = 'Highly Competitive Market';
      } else if (competitorCount > 5) {
        analysis.marketPosition = 'Moderately Competitive Market';
      } else {
        analysis.marketPosition = 'Niche Market';
      }

      // Analyze company strengths
      if (company.verificationStatus?.name?.verified) {
        analysis.strengths.push('Strong Brand Verification');
      }
      if (company.language.length > 2) {
        analysis.strengths.push('Global Market Presence');
      }

      // Identify opportunities
      const competitorCategories = new Set(
        competitors.flatMap((c) => c.category)
      );
      const uniqueCategories = company.category.filter(
        (cat) => !competitorCategories.has(cat)
      );
      if (uniqueCategories.length > 0) {
        analysis.opportunities.push('Unique Market Categories');
      }

      return analysis;
    },
    []
  );

  // Keyword Extraction
  const extractKeywords = useCallback((text: string) => {
    const tokenizer = new WordTokenizer();
    const tokens = tokenizer.tokenize(text);
    const stopWords = new Set([
      'the',
      'and',
      'a',
      'an',
      'is',
      'in',
      'it',
      'of',
      'to',
      'for',
      'with',
    ]);

    const keywords = tokens.filter((token) => !stopWords.has(token));

    return keywords;
  }, []);

  return {
    analyzeSentiment,
    findSimilarCompanies,
    analyzeMarketTrends,
    detectAnomalies,
    analyzeCompetitiveLandscape,
    extractKeywords,
  };
};
