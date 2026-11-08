import { genaires } from "@/lib/gemini";
import { genskills } from "@/types/ai.type";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest){
    try {
        const body:genskills=await req.json();

        const { experiencelevel, jobTitle}=body;

        if(!experiencelevel || !jobTitle){
            return NextResponse.json<Apiresponse>({
                success:false,
                message:"missing fields in gen skills"
            },{status:400})
        }

const prompt = `List the most relevant ATS friendly resume skills for the role below.

Job title: ${jobTitle}
Experience level: ${experiencelevel}

Give 10 to 12 skills mixing core technical skills, tools and a few soft skills. Match depth to the experience level. Use standard industry keywords only, no duplicates.

Return ONLY a valid JSON array of strings, for example ["HTML", "CSS", "React"]. No markdown, no code fences, no extra text.`;

const parseSkills = (text: string): string[] => {
    const cleaned = text.replace(/```json|```/g, "").trim();
    
    try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
            return parsed.map((s) => String(s).trim()).filter(Boolean);
        }
    } catch {}
    
    return cleaned
    .replace(/[\[\]"*#`\n]/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const result= await genaires(prompt);
        const skills= parseSkills(result!); 

       return NextResponse.json<Apiresponse>({
        success:true,
        message:"skills is created",data:{skills}
       },{status:201})

    } catch (error) {
              console.log("error in gen skills resume api",error);
                return NextResponse.json<Apiresponse>({
                    success:false,
                    message:"something wrong in gen skills",error:{error}
        
                },{status:500})
    }
}