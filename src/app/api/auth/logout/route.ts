import { Apiresponse } from "@/types/apitype";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json<Apiresponse>({
    success: true,
    message: "Logged out successfully",
  });
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}

