import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API
});

export async function genaires(prompt:string) {
    const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
});
return interaction.output_text;
}

