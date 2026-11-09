import { genaires } from "@/lib/gemini";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { resumetext } = body;

    if (!resumetext) {
      return NextResponse.json<Apiresponse>(
        {
          success: false,
          message: "missing fields in ats score",
        },
        { status: 400 },
      );
    }

   const prompt = `You are an ATS (Applicant Tracking System) resume analyzer. Evaluate the resume text below and give an honest ATS score.

Resume text:
${resumetext}

Score out of 100 using this breakdown:
1. Keywords and skills relevance: 30 points
2. Section completeness (contact, summary, skills, experience, education, projects): 25 points
3. Content quality (action verbs, clear impact, concise wording): 25 points
4. Formatting and readability (consistent structure, no clutter, proper length): 20 points

Be strict and realistic, do not inflate the score. Judge only what is present in the text.

Return ONLY a valid JSON object in this exact shape:
{
  "breakdown": { "keywords": number, "sections": number, "content": number, "formatting": number },
  "strengths": [string, string, string],
  "improvements": [string, string, string, string],
  "missingSections": [string],
  "suggestedKeywords": [string]
}

Each strength and improvement must be under 20 words, specific and actionable. No markdown, no code fences, no extra text.`;

    const result = await genaires(prompt);

    const atsdata = result;

    return NextResponse.json<Apiresponse>(
      {
        success: true,
        message: "ats data is created",
        data: { atsdata },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error in ats score resume api", error);
    return NextResponse.json<Apiresponse>(
      {
        success: false,
        message: "something wrong in ats score",
        error: { error },
      },
      { status: 500 },
    );
  }
}
