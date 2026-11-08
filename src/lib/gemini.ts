import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API
});

export async function genaires(prompt:string) {
    const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt,
});
console.log(interaction.output_text);
}

