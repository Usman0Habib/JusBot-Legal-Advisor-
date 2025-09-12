import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch(e) {
    console.error("Failed to initialize GoogleGenAI. Is the API_KEY set?", e);
}

/**
 * Creates and returns a new Gemini chat session.
 * This allows for managing separate, stateful conversation histories.
 * @param {string} model - The Gemini model to use (e.g., 'gemini-2.5-flash').
 * @param {string} systemInstruction - The system instruction for the AI.
 * @returns {Chat} A chat instance.
 */
export const startChatSession = (model: string, systemInstruction: string): Chat => {
    if (!ai) {
        throw new Error("Gemini API not initialized. Please check your API key.");
    }
    return ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
        },
    });
};
