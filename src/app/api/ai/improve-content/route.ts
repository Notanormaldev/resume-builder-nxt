import { genaires } from "@/lib/gemini";
import {  impcontent } from "@/types/ai.type";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: impcontent = await req.json();

    const { content } = body;

    if (!content) {
      return NextResponse.json<Apiresponse>(
        {
          success: false,
          message: "missing fields in imp content",
        },
        { status: 400 },
      );
    }

    const prompt = `Improve the resume content below and make it ATS friendly.

Resume content: ${content}

Rewrite it with strong action verbs, clear and concise wording, and relevant keywords already present in the content. Fix grammar and spelling. Keep the same meaning and roughly the same length. Keep the same format as the input: a paragraph stays a paragraph, separate lines stay separate lines.

Do not invent numbers, skills, tools, companies or achievements that are not in the content. No "I" or "my", no filler words, no symbols, no dashes.

Return only the improved content, nothing else. No intro, no heading, no quotes, no explanation.`;

    const result = await genaires(prompt);

    const newcontent = result;

    return NextResponse.json<Apiresponse>(
      {
        success: true,
        message: "imp content is created",
        data: { newcontent },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error in imp content resume api", error);
    return NextResponse.json<Apiresponse>(
      {
        success: false,
        message: "something wrong in imp content",
        error: { error },
      },
      { status: 500 },
    );
  }
}
