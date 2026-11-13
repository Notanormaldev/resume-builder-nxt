import { connectdb } from "@/lib/dbconnection";
import { getcurrentuser } from "@/lib/getCurrentuser";
import { usermodel } from "@/models/usermodel";
import { Apiresponse } from "@/types/apitype";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectdb();
    const userResult = await getcurrentuser();
    const userId = typeof userResult === "object" && userResult !== null ? (userResult as any).userId : userResult;

    const user = await usermodel.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json<Apiresponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<Apiresponse>({
      success: true,
      message: "Current user found",
      data: { user: { _id: user._id, name: user.name, email: user.email, mobile: user.mobile } },
    });
  } catch (error) {
    return NextResponse.json<Apiresponse>(
      { success: false, message: "Unauthorized", error: { error } },
      { status: 401 }
    );
  }
}

