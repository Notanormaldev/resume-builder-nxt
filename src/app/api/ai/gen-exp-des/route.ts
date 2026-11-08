import { genaires } from "@/lib/gemini";
import { genexpdes } from "@/types/ai.type";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest){
    try {
        const body:genexpdes=await req.json();

        const {   experiencelevel,  techstack,yoe,jobrole}=body

        if(!experiencelevel || !techstack|| !jobrole || !yoe){
            return NextResponse.json<Apiresponse>({
                success:false,
                message:"missing fields in gen exp description"
            },{status:400})
        }


 const prompt = `Write the work experience description for a resume as one single paragraph.

Job role: ${jobrole}
Experience level: ${experiencelevel}
Years of experience: ${yoe}
Tech stack: ${Array.isArray(techstack) ? techstack.join(", ") : techstack}

Length must be 50 to 70 words, ATS friendly, plain text. Start with a strong action verb. Cover responsibilities, how the tech stack was used, and the impact of the work. Match the scope to the years of experience: fewer years should focus on implementation and learning, more years should show ownership, mentoring and technical decisions.

Do not invent numbers, company names, clients or tools outside the tech stack. No "I" or "my", no filler words, no bullet points, no symbols, no dashes.

Return only the paragraph text, nothing else.`;


       const result = await genaires(prompt);
       
       const workexpdes=result;

       return NextResponse.json<Apiresponse>({
        success:true,
        message:"work exp des is created",data:{workexpdes}
       },{status:201})

    } catch (error) {
              console.log("error in gen work exp des resume api",error);
                return NextResponse.json<Apiresponse>({
                    success:false,
                    message:"something wrong in gen work exp des",error:{error}
        
                },{status:500})
    }
}