import { connectdb } from "@/lib/dbconnection";
import { getcurrentuser } from "@/lib/getCurrentuser";
import { resumemodel } from "@/models/resumemodel";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectdb();
    const userResult = await getcurrentuser();
    const userId = typeof userResult === "object" && userResult !== null ? (userResult as any).userId : userResult;

    const resumes = await resumemodel.find({ user_id: userId }).sort({ updatedAt: -1 });

    return NextResponse.json<Apiresponse>({
      success: true,
      message: "Resumes fetched successfully",
      data: resumes,
    });
  } catch (error) {
    return NextResponse.json<Apiresponse>(
      {
        success: false,
        message: "Failed to fetch resumes",
        error: { error },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectdb();
    const userResult = await getcurrentuser();
    const userId = typeof userResult === "object" && userResult !== null ? (userResult as any).userId : userResult;
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json<Apiresponse>(
        { success: false, message: "Resume ID is required" },
        { status: 400 }
      );
    }

    const deleted = await resumemodel.findOneAndDelete({ _id: resumeId, user_id: userId });
    if (!deleted) {
      return NextResponse.json<Apiresponse>(
        { success: false, message: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json<Apiresponse>({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return NextResponse.json<Apiresponse>(
      { success: false, message: "Failed to delete resume", error: { error } },
      { status: 500 }
    );
  }
}

