import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// this model looks good
export async function getEmbedding(text) {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [text]
    });
    return response.embeddings[0].values;
}

// Generate content given a prompt (context-aware)
export async function generateFromContext(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
    });
    return response.outputText || response.candidates?.[0]?.content?.parts?.[0]?.text;
}
