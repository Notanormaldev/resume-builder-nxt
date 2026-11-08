import { genaires } from "@/lib/gemini";
import { genproject} from "@/types/ai.type";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest){
    try {
        const body:genproject=await req.json();

        const { experiencelevel, techstack, jobTitle,pname}=body;

        if(!experiencelevel || !techstack || !jobTitle ||!pname){
            return NextResponse.json<Apiresponse>({
                success:false,
                message:"missing fields in gen gen project des"
            },{status:400})
        }


const prompt = `Write a resume project description for the role below.

Job title: ${jobTitle}
Experience level: ${experiencelevel}
Tech stack: ${Array.isArray(techstack) ? techstack.join(", ") : techstack}
project name:${pname}

Create a realistic project that fits this role and uses the given tech stack. Write it in 40 to 60 words as one plain text paragraph, ATS friendly. Mention what the project does, how the tech stack is used, and the outcome. Start with a strong action word. Match the project complexity to the experience level.

Do not invent numbers, company names or tools outside the tech stack. No "I" or "my", no filler words, no symbols, no dashes.

Return only the description text, nothing else.`;

       const result = await genaires(prompt);
       
       const description=result;

       return NextResponse.json<Apiresponse>({
        success:true,
        message:"project des is created",data:{description}
       },{status:201})

    } catch (error) {
              console.log("error in gen project des resume api",error);
                return NextResponse.json<Apiresponse>({
                    success:false,
                    message:"something wrong in gen project des",error:{error}
        
                },{status:500})
    }
}