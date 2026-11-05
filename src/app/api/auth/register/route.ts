import { connectdb } from "@/lib/dbconnection";
import { Registerbody } from "@/types/usertypes";
import { NextRequest, NextResponse } from "next/server";


// export function GET(req:NextRequest){
//     return NextResponse.json({
//         msg:"dorame doremon"
//     })
// }

async function POST(req:NextRequest){
  try {
    await connectdb();
  let body:Registerbody=await req.json();

  } catch (error) {
      console.log("register db error on post req",error);
      
  }
}