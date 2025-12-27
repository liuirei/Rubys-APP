
import { GoogleGenAI, Type } from "@google/genai";
import { GameCard } from "../types";

// 封裝 API 初始化，確保在呼叫時才建立實例
const getAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateExtraTabooCards = async (count: number = 5): Promise<GameCard[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} unique Halloween-themed Taboo game cards. 
      Each card must have:
      1. A main English word.
      2. 3-4 "taboo" words that shouldn't be used to describe it.
      3. A Chinese translation for the main word.
      4. A brief keyword to search for a representative image.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              taboo: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              zh: { type: Type.STRING },
              img: { type: Type.STRING }
            },
            required: ["word", "taboo", "zh", "img"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    return rawData.map((item: any) => ({
      ...item,
      img: `https://loremflickr.com/400/400/halloween,${encodeURIComponent(item.img || item.word)}`
    }));
  } catch (error) {
    console.error("Error generating cards with Gemini:", error);
    return [];
  }
};

export const getSpookyHint = async (word: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give me a very short, spooky, 1-sentence hint for the word "${word}" without using the word itself or any common synonyms.`,
    });
    return response.text?.trim() || "Something scary is coming...";
  } catch (error) {
    return "Something scary is coming...";
  }
};
