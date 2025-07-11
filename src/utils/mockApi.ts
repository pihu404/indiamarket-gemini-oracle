
import { PredictionResult } from "@/types/stock";
import { analyzeStockWithGemini } from "@/api/gemini";

// Mock stock data for demonstration
const mockStockData: Record<string, Partial<PredictionResult>> = {
  'AAPL': {
    companyName: 'Apple Inc.',
    currentPrice: 190.50,
  },
  'TSLA': {
    companyName: 'Tesla Inc.',
    currentPrice: 248.75,
  },
  'MSFT': {
    companyName: 'Microsoft Corporation',
    currentPrice: 378.25,
  },
  'GOOGL': {
    companyName: 'Alphabet Inc.',
    currentPrice: 140.80,
  },
  'AMZN': {
    companyName: 'Amazon.com Inc.',
    currentPrice: 155.30,
  }
};

export const mockAnalyzeStock = async (symbol: string): Promise<PredictionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

  try {
    // Try to get real AI analysis from Gemini
    const geminiResult = await analyzeStockWithGemini(symbol);
    return geminiResult;
  } catch (error) {
    console.log('Gemini API failed, using fallback mock data:', error);
    
    // Fallback to mock data if Gemini fails
    const mockData = mockStockData[symbol.toUpperCase()];
    const predictions = ['BULLISH', 'BEARISH', 'NEUTRAL'] as const;
    const sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] as const;
    const volatilities = ['LOW', 'MEDIUM', 'HIGH'] as const;
    const recommendations = ['BUY', 'SELL', 'HOLD'] as const;
    
    const prediction = predictions[Math.floor(Math.random() * predictions.length)];
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
    const currentPrice = mockData?.currentPrice || Math.random() * 200 + 50;
    const priceChange = (Math.random() - 0.5) * 0.2; // -10% to +10%
    
    return {
      symbol: symbol.toUpperCase(),
      companyName: mockData?.companyName || `${symbol.toUpperCase()} Corporation`,
      currentPrice,
      prediction,
      confidence,
      priceTarget: currentPrice * (1 + priceChange),
      timeframe: '3-6 months',
      reasoning: `Based on current market analysis, ${symbol.toUpperCase()} shows ${prediction.toLowerCase()} signals. Technical indicators suggest moderate ${prediction.toLowerCase()} momentum with ${confidence}% confidence level.`,
      technicalFactors: [
        'Moving averages showing positive trend',
        'Volume indicators suggest institutional interest',
        'Support levels holding strong',
        'RSI indicates favorable momentum'
      ],
      riskFactors: [
        'Market volatility concerns',
        'Regulatory uncertainty',
        'Economic headwinds',
        'Sector-specific challenges'
      ],
      marketSentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      volatilityLevel: volatilities[Math.floor(Math.random() * volatilities.length)],
      recommendation: recommendations[Math.floor(Math.random() * recommendations.length)]
    };
  }
};
