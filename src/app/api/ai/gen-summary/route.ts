import { genaires } from "@/lib/gemini";
import { gensummary } from "@/types/ai.type";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest){
    try {
        const body:gensummary=await req.json();

        const { experiencelevel, skills, jobTitle}=body;

        if(!experiencelevel || !skills || !jobTitle){
            return NextResponse.json<Apiresponse>({
                success:false,
                message:"missing fields in gen summary"
            },{status:400})
        }


        const prompt= `Output ONLY the final professional summary text. No intro line, no heading, no label, no quotes, no explanation, no notes after it.

You are an expert resume writer who specializes in ATS friendly professional summaries.

Job title: ${jobTitle}
Experience level: ${experiencelevel}
Skills: ${skills}

Rules:
1. Length must be 50 to 80 words. One single paragraph.
2. Start with the experience level and job title, for example "Entry level Frontend Developer with...".
3. Use the given skills naturally as keywords. Never invent skills, tools, companies, degrees, or numbers that were not provided.
4. Plain text only. No bullet points, no markdown, no emojis, no special characters, no dashes.
5. Do not use "I", "my", or "me". Use a confident, professional tone with strong action words.
6. Avoid filler words like passionate, hardworking, team player, go getter.

Your entire response must be the summary paragraph and nothing else.`;

       const result = await genaires(prompt);
       
       const summary=result;

       return NextResponse.json<Apiresponse>({
        success:true,
        message:"summary is created",data:{summary}
       },{status:201})

    } catch (error) {
              console.log("error in gen summary resume api",error);
                return NextResponse.json<Apiresponse>({
                    success:false,
                    message:"something wrong in gen summary",error:{error}
        
                },{status:500})
    }
}