
import { GoogleGenAI, Type } from "@google/genai";
import { GameCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateExtraTabooCards = async (count: number = 5): Promise<GameCard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} unique Halloween-themed Taboo game cards. 
      Each card must have:
      1. A main English word.
      2. 3-4 "taboo" words that shouldn't be used to describe it.
      3. A Chinese translation for the main word.
      4. A brief keyword to search for a representative image on Unsplash/Picsum.`,
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
              img: { type: Type.STRING, description: "Just a search keyword for an image" }
            },
            required: ["word", "taboo", "zh", "img"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text);
    return rawData.map((item: any) => ({
      ...item,
      // Map search keyword to a placeholder image service
      img: `https://loremflickr.com/400/400/halloween,${encodeURIComponent(item.img)}`
    }));
  } catch (error) {
    console.error("Error generating cards with Gemini:", error);
    return [];
  }
};

export const getSpookyHint = async (word: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give me a very short, spooky, 1-sentence hint for the word "${word}" without using the word itself or any common synonyms.`,
    });
    return response.text.trim();
  } catch (error) {
    return "Something scary is coming...";
  }
};
