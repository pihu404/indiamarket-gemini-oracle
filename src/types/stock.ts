
export interface PredictionResult {
  symbol: string;
  companyName: string;
  currentPrice: number;
  prediction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  priceTarget: number;
  timeframe: string;
  reasoning: string;
  technicalFactors: string[];
  riskFactors: string[];
  marketSentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  volatilityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: 'BUY' | 'SELL' | 'HOLD';
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}
