
// Free API service for real-time stock prices
const ALPHA_VANTAGE_API_KEY = 'demo'; // Users can replace with their own key
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Fallback to Yahoo Finance API (no key required)
const YAHOO_FINANCE_API = 'https://query1.finance.yahoo.com/v8/finance/chart';

export interface RealStockPrice {
  symbol: string;
  price: number;
  currency: string;
  lastUpdated: string;
}

// Convert USD to INR (approximate rate, in real app this should be fetched too)
const USD_TO_INR = 83;

export const fetchRealStockPrice = async (symbol: string): Promise<RealStockPrice> => {
  try {
    // Try Yahoo Finance first (no API key required)
    const yahooResponse = await fetch(`${YAHOO_FINANCE_API}/${symbol}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (yahooResponse.ok) {
      const yahooData = await yahooResponse.json();
      const result = yahooData.chart?.result?.[0];
      
      if (result && result.meta) {
        const price = result.meta.regularMarketPrice || result.meta.previousClose;
        const currency = result.meta.currency;
        
        // Convert to INR if needed
        const finalPrice = currency === 'USD' ? price * USD_TO_INR : price;
        
        return {
          symbol: symbol.toUpperCase(),
          price: finalPrice,
          currency: currency === 'USD' ? 'INR' : currency,
          lastUpdated: new Date().toISOString()
        };
      }
    }
  } catch (error) {
    console.log('Yahoo Finance API failed, trying Alpha Vantage:', error);
  }

  try {
    // Fallback to Alpha Vantage
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (quote && quote['05. price']) {
        const price = parseFloat(quote['05. price']);
        const finalPrice = price * USD_TO_INR; // Convert to INR
        
        return {
          symbol: symbol.toUpperCase(),
          price: finalPrice,
          currency: 'INR',
          lastUpdated: quote['07. latest trading day']
        };
      }
    }
  } catch (error) {
    console.log('Alpha Vantage API failed:', error);
  }

  // If all APIs fail, throw error
  throw new Error(`Unable to fetch real price for ${symbol}`);
};

// Indian stock symbols mapping for NSE/BSE
export const getIndianStockSymbol = (symbol: string): string => {
  const indianStocks: Record<string, string> = {
    'RELIANCE': 'RELIANCE.NS',
    'TCS': 'TCS.NS',
    'HDFCBANK': 'HDFCBANK.NS',
    'INFY': 'INFY.NS',
    'ITC': 'ITC.NS',
    'TATASTEEL': 'TATASTEEL.NS',
    'WIPRO': 'WIPRO.NS',
    'ASIANPAINT': 'ASIANPAINT.NS',
    'MARUTI': 'MARUTI.NS',
    'HDFC': 'HDFC.NS'
  };

  return indianStocks[symbol.toUpperCase()] || symbol;
};
