import { GoogleGenAI, Type } from "@google/genai";

// Cache for predictions to avoid spamming the API and feeling laggy on tabs
const predictionCache = new Map<string, any>();

export async function generatePrediction(symbol: string, assetData: any) {
  if (predictionCache.has(symbol)) {
    return predictionCache.get(symbol);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are QuantPro, an advanced AI quantitative analyst and financial predictor.
Analyze the following asset data for ${symbol}.
Consider typical technical analysis (moving averages, momentum, volatility based on the mocked OHLC data provided).
Also factor in simulated global news sentiment and macroeconomic indicators. 

Asset Data Summary:
${JSON.stringify({
  symbol,
  currentPrice: assetData.price,
  change: assetData.change,
  daysOfData: assetData.data.length,
  recentClosePrices: assetData.data.slice(0, 5).map((d: any) => d.close)
})}

Provide a structured recommendation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior quantitative analyst providing data-driven, probabilistically grounded financial predictions. Never guarantee returns. Explain your reasoning clearly.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: {
              type: Type.STRING,
              description: "Must be 'BUY', 'SELL', or 'HOLD'",
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "A number between 0 and 100 representing confidence.",
            },
            riskLevel: {
              type: Type.STRING,
              description: "Low, Medium, or High",
            },
            targetPrice: {
              type: Type.NUMBER,
              description: "The projected target price for the asset in USD over the next 30 days.",
            },
            stopLoss: {
              type: Type.NUMBER,
              description: "Suggested stop loss price.",
            },
            reasoning: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 bullet points explaining the analysis and reasoning.",
            }
          },
          required: ["recommendation", "confidenceScore", "riskLevel", "targetPrice", "stopLoss", "reasoning"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    const parsed = JSON.parse(resultText);
    predictionCache.set(symbol, parsed);
    return parsed;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
