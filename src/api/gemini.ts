
const GEMINI_API_KEY = 'AIzaSyBiA1-a3wslCTdzLOEaMY7U8iJBGS0ETzU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const analyzeStockWithGemini = async (symbol: string) => {
  const prompt = `
    As an AI financial analyst, provide a detailed stock analysis for ${symbol}. 
    
    Please analyze the following aspects and respond with a JSON object containing:
    - symbol: "${symbol}"
    - companyName: (research and provide the full company name)
    - currentPrice: (current price in Indian Rupees INR - for Indian stocks use actual INR prices, for US stocks convert from USD to INR using current exchange rate ~83 INR per USD)
    - prediction: ("BULLISH", "BEARISH", or "NEUTRAL")
    - confidence: (confidence level as percentage 0-100)
    - priceTarget: (predicted price target in INR)
    - timeframe: (prediction timeframe, e.g., "3-6 months")
    - reasoning: (detailed explanation of your analysis mentioning currency context)
    - technicalFactors: (array of positive technical indicators)
    - riskFactors: (array of potential risks)
    - marketSentiment: ("POSITIVE", "NEGATIVE", or "NEUTRAL")
    - volatilityLevel: ("LOW", "MEDIUM", or "HIGH")
    - recommendation: ("BUY", "SELL", or "HOLD")

    Base your analysis on:
    1. Recent market trends and performance
    2. Company fundamentals and business model
    3. Industry outlook and competitive position
    4. Economic indicators and market conditions (Indian and global)
    5. Technical analysis patterns
    6. News sentiment and market psychology

    IMPORTANT: All prices must be in Indian Rupees (INR). For Indian stocks listed on NSE/BSE, use actual INR prices. For US stocks, convert USD prices to INR using approximate exchange rate of 83 INR per USD.

    Provide realistic and well-reasoned predictions. Return only valid JSON without any markdown formatting.
  `;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Clean the response and parse JSON
    const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', cleanedText);
      throw new Error('Invalid JSON response from AI');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};
