import { Type } from "@google/genai";

export interface WordAnalysis {
  word: string;
  phonetic?: string;
  coreMeaning: string;
  structure: {
    prefix?: { text: string; meaning: string };
    root: { text: string; meaning: string; origin: string };
    suffix?: { text: string; meaning: string };
  };
  relatedWords: string[];
  etymology: {
    origin: string;
    story?: string;
    language: "Latin" | "Greek" | "Old French" | "Germanic" | "Other";
  };
  context: {
    collocations: string[];
    exampleSentence: string;
    miniParagraph: string;
  };
  frenchConnection: {
    frenchWord: string;
    type: "Cognate" | "Related" | "Translation";
    frenchExample: string;
    similarityNote: string;
  };
}

export const wordAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    phonetic: { type: Type.STRING },
    coreMeaning: { type: Type.STRING },
    structure: {
      type: Type.OBJECT,
      properties: {
        prefix: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            meaning: { type: Type.STRING },
          },
        },
        root: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            meaning: { type: Type.STRING },
            origin: { type: Type.STRING },
          },
          required: ["text", "meaning", "origin"],
        },
        suffix: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            meaning: { type: Type.STRING },
          },
        },
      },
      required: ["root"],
    },
    relatedWords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    etymology: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING },
        story: { type: Type.STRING },
        language: { type: Type.STRING },
      },
      required: ["origin", "language"],
    },
    context: {
      type: Type.OBJECT,
      properties: {
        collocations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        exampleSentence: { type: Type.STRING },
        miniParagraph: { type: Type.STRING },
      },
      required: ["collocations", "exampleSentence", "miniParagraph"],
    },
    frenchConnection: {
      type: Type.OBJECT,
      properties: {
        frenchWord: { type: Type.STRING },
        type: { type: Type.STRING },
        frenchExample: { type: Type.STRING },
        similarityNote: { type: Type.STRING },
      },
      required: ["frenchWord", "type", "frenchExample", "similarityNote"],
    },
  },
  required: [
    "word",
    "coreMeaning",
    "structure",
    "relatedWords",
    "etymology",
    "context",
    "frenchConnection",
  ],
};
