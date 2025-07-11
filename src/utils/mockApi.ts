
import { PredictionResult } from "@/types/stock";
import { analyzeStockWithGemini } from "@/api/gemini";

// Mock stock data with realistic Indian stock prices in INR
const mockStockData: Record<string, Partial<PredictionResult>> = {
  'AAPL': {
    companyName: 'Apple Inc.',
    currentPrice: 15750.00, // ~$190 converted to INR
  },
  'TSLA': {
    companyName: 'Tesla Inc.',
    currentPrice: 20600.00, // ~$248 converted to INR
  },
  'MSFT': {
    companyName: 'Microsoft Corporation',
    currentPrice: 31350.00, // ~$378 converted to INR
  },
  'GOOGL': {
    companyName: 'Alphabet Inc.',
    currentPrice: 11675.00, // ~$140 converted to INR
  },
  'AMZN': {
    companyName: 'Amazon.com Inc.',
    currentPrice: 12870.00, // ~$155 converted to INR
  },
  'TATASTEEL': {
    companyName: 'Tata Steel Limited',
    currentPrice: 145.50, // Realistic INR price
  },
  'RELIANCE': {
    companyName: 'Reliance Industries Limited',
    currentPrice: 2850.75, // Realistic INR price
  },
  'INFY': {
    companyName: 'Infosys Limited',
    currentPrice: 1720.30,
  },
  'TCS': {
    companyName: 'Tata Consultancy Services',
    currentPrice: 4125.80,
  },
  'HDFCBANK': {
    companyName: 'HDFC Bank Limited',
    currentPrice: 1642.90,
  },
  'ITC': {
    companyName: 'ITC Limited',
    currentPrice: 462.35,
  },
  'WIPRO': {
    companyName: 'Wipro Limited',
    currentPrice: 298.75,
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
    const currentPrice = mockData?.currentPrice || getRealisticPrice(symbol);
    const priceChange = (Math.random() - 0.5) * 0.2; // -10% to +10%
    
    return {
      symbol: symbol.toUpperCase(),
      companyName: mockData?.companyName || `${symbol.toUpperCase()} Corporation`,
      currentPrice,
      prediction,
      confidence,
      priceTarget: currentPrice * (1 + priceChange),
      timeframe: '3-6 months',
      reasoning: `Based on current market analysis, ${symbol.toUpperCase()} shows ${prediction.toLowerCase()} signals. Technical indicators suggest moderate ${prediction.toLowerCase()} momentum with ${confidence}% confidence level. Price analysis considers recent volatility and market sentiment in the Indian equity markets.`,
      technicalFactors: [
        'Moving averages showing positive trend',
        'Volume indicators suggest institutional interest',
        'Support levels holding strong',
        'RSI indicates favorable momentum'
      ],
      riskFactors: [
        'Market volatility concerns',
        'Regulatory uncertainty in Indian markets',
        'Global economic headwinds',
        'Sector-specific challenges'
      ],
      marketSentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      volatilityLevel: volatilities[Math.floor(Math.random() * volatilities.length)],
      recommendation: recommendations[Math.floor(Math.random() * recommendations.length)]
    };
  }
};

// Helper function to generate realistic prices for unknown stocks
const getRealisticPrice = (symbol: string): number => {
  // Generate realistic Indian stock prices based on symbol patterns
  const isUSStock = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META'].includes(symbol.toUpperCase());
  
  if (isUSStock) {
    // US stocks converted to INR (assuming 1 USD = 83 INR)
    return Math.random() * 20000 + 5000; // 5k to 25k INR range
  }
  
  // Indian stocks - realistic price ranges
  const largeCap = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC'];
  const midCap = ['TATASTEEL', 'WIPRO', 'TECHM', 'MARUTI'];
  
  if (largeCap.includes(symbol.toUpperCase())) {
    return Math.random() * 3000 + 500; // 500 to 3500 INR
  } else if (midCap.includes(symbol.toUpperCase())) {
    return Math.random() * 800 + 100; // 100 to 900 INR
  } else {
    return Math.random() * 500 + 50; // 50 to 550 INR for others
  }
};
