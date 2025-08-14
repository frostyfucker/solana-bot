
import { GoogleGenAI, Type } from "@google/genai";
import { Strategy } from '../types';
import { generateUniqueId } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateAiStrategy = async (goal: string): Promise<Strategy> => {
    if(!API_KEY) {
        // Fallback for when API key is not available
        return {
            id: generateUniqueId(),
            name: `AI: ${goal.substring(0, 20)}...`,
            description: `A custom strategy based on the goal: "${goal}".`,
            riskLevel: 'Medium'
        };
    }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the user's investment goal of "${goal}", generate a creative and professional-sounding trading strategy. Provide a name, a concise one-sentence description, and assess its risk level as 'Low', 'Medium', or 'High'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The name of the strategy." },
            description: { type: Type.STRING, description: "A one-sentence description." },
            riskLevel: {
              type: Type.STRING,
              description: "The assessed risk level.",
              enum: ['Low', 'Medium', 'High']
            }
          },
          required: ['name', 'description', 'riskLevel']
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    if (!parsedResponse.name || !parsedResponse.description || !parsedResponse.riskLevel) {
        throw new Error("Invalid response structure from AI");
    }

    return {
      id: generateUniqueId(),
      name: parsedResponse.name,
      description: parsedResponse.description,
      riskLevel: parsedResponse.riskLevel as 'Low' | 'Medium' | 'High',
    };
  } catch (error) {
    console.error("Error generating AI strategy:", error);
    throw new Error("Could not generate strategy from AI.");
  }
};