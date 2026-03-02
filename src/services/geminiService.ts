import { GoogleGenAI } from "@google/genai";
import { WordAnalysis, wordAnalysisSchema } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeWord(word: string): Promise<WordAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the English word "${word}" for a language learner. 
    Provide a deep structural breakdown (prefix, root, suffix), etymology, context, and its connection to French.
    Focus on memory-enhancing stories and structural logic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: wordAnalysisSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text) as WordAnalysis;
}
