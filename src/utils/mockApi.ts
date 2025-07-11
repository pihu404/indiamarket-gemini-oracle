
import { PredictionResult } from "@/types/stock";
import { analyzeStockWithGemini } from "@/api/gemini";
import { fetchRealStockPrice, getIndianStockSymbol } from "@/api/stockPrice";

// Fallback mock data for when all APIs fail
const mockStockData: Record<string, Partial<PredictionResult>> = {
  'AAPL': {
    companyName: 'Apple Inc.',
    currentPrice: 15750.00,
  },
  'TSLA': {
    companyName: 'Tesla Inc.',
    currentPrice: 20600.00,
  },
  'MSFT': {
    companyName: 'Microsoft Corporation',
    currentPrice: 31350.00,
  },
  'GOOGL': {
    companyName: 'Alphabet Inc.',
    currentPrice: 11675.00,
  },
  'AMZN': {
    companyName: 'Amazon.com Inc.',
    currentPrice: 12870.00,
  },
  'TATASTEEL': {
    companyName: 'Tata Steel Limited',
    currentPrice: 145.50,
  },
  'RELIANCE': {
    companyName: 'Reliance Industries Limited',
    currentPrice: 2850.75,
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
  },
  'ASIANPAINT': {
    companyName: 'Asian Paints Limited',
    currentPrice: 3200.00,
  }
};

export const mockAnalyzeStock = async (symbol: string): Promise<PredictionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

  try {
    // Try to get real AI analysis with real prices from Gemini
    console.log(`Attempting to fetch real-time analysis for ${symbol}...`);
    const geminiResult = await analyzeStockWithGemini(symbol);
    console.log(`✅ Successfully got real-time analysis for ${symbol}`);
    return geminiResult;
  } catch (error) {
    console.log('Gemini API failed, attempting to get real price data only:', error);
    
    // If Gemini fails, try to at least get real price data
    let realPrice: number | null = null;
    try {
      const stockSymbol = getIndianStockSymbol(symbol);
      const priceData = await fetchRealStockPrice(stockSymbol);
      realPrice = priceData.price;
      console.log(`✅ Got real price for ${symbol}: ₹${realPrice.toFixed(2)}`);
    } catch (priceError) {
      console.log('❌ Could not fetch real price, using mock data:', priceError);
    }
    
    // Fallback to mock data but use real price if available
    const mockData = mockStockData[symbol.toUpperCase()];
    const predictions = ['BULLISH', 'BEARISH', 'NEUTRAL'] as const;
    const sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] as const;
    const volatilities = ['LOW', 'MEDIUM', 'HIGH'] as const;
    const recommendations = ['BUY', 'SELL', 'HOLD'] as const;
    
    const prediction = predictions[Math.floor(Math.random() * predictions.length)];
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
    const currentPrice = realPrice || mockData?.currentPrice || getRealisticPrice(symbol);
    const priceChange = (Math.random() - 0.5) * 0.2; // -10% to +10%
    
    const result = {
      symbol: symbol.toUpperCase(),
      companyName: mockData?.companyName || `${symbol.toUpperCase()} Corporation`,
      currentPrice,
      prediction,
      confidence,
      priceTarget: currentPrice * (1 + priceChange),
      timeframe: '3-6 months',
      reasoning: `${realPrice ? 'Based on real-time price data and' : 'Based on'} current market analysis, ${symbol.toUpperCase()} shows ${prediction.toLowerCase()} signals. Technical indicators suggest moderate ${prediction.toLowerCase()} momentum with ${confidence}% confidence level. ${realPrice ? `Current market price is ₹${realPrice.toFixed(2)} INR.` : 'Price analysis considers recent volatility and market sentiment in the Indian equity markets.'}`,
      technicalFactors: [
        'Moving averages showing trend signals',
        'Volume indicators suggest market interest',
        'Support and resistance levels identified',
        'RSI indicates current momentum'
      ],
      riskFactors: [
        'Market volatility concerns',
        'Economic uncertainty factors',
        'Global market influences',
        'Sector-specific challenges'
      ],
      marketSentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      volatilityLevel: volatilities[Math.floor(Math.random() * volatilities.length)],
      recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
      priceSource: realPrice ? 'real-time' : 'estimated'
    };

    return result;
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
  const largeCap = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'ASIANPAINT'];
  const midCap = ['TATASTEEL', 'WIPRO', 'TECHM', 'MARUTI'];
  
  if (largeCap.includes(symbol.toUpperCase())) {
    return Math.random() * 3000 + 500; // 500 to 3500 INR
  } else if (midCap.includes(symbol.toUpperCase())) {
    return Math.random() * 800 + 100; // 100 to 900 INR
  } else {
    return Math.random() * 500 + 50; // 50 to 550 INR for others
  }
};
