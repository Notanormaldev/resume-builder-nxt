import { connectdb } from "@/lib/dbconnection";
import { genratetokenjwt } from "@/lib/jwt";
import { usermodel } from "@/models/usermodel";
import { Apiresponse } from "@/types/apitype";
import { Registerbody } from "@/types/usertypes";
import { NextRequest, NextResponse } from "next/server";


// export function GET(req:NextRequest){
//     return NextResponse.json({
//         msg:"dorame doremon"
//     })
// }

export async function POST(req:NextRequest){
  try {
    await connectdb();
  let body:Registerbody=await req.json();

  let { name ,email,mobile,password}=body;
   if(!email||!name||!password){
        return NextResponse.json<Apiresponse>({
          success:false,message:"All fields are required"
        },{
          status:400
        })
   }

  let isexisted = await usermodel.findOne({email})

  if(isexisted){
    return NextResponse.json<Apiresponse>({
      success:false, message:"user already exist please login"
    },{
      status:409
    })
  }

  let newuser = await usermodel.create({
    name,email,password,mobile
  })

  let token = genratetokenjwt({userId:newuser._id.toString()})
  
  let response = NextResponse.json<Apiresponse>({
    success:true , message:"user register successfully",data:{
      user:{
        _id:newuser._id,
        name:newuser.name,
        email:newuser.email
      }
    }
  },{
    status:201
  })
  

  response.cookies.set('token',token,{
    httpOnly:true,
    sameSite:'lax',
    maxAge:60*60*1000
  })
 

  return response;
  } catch (error) {
      console.log("register db error on post req",error);
      return NextResponse.json<Apiresponse>({
        success:false,message:"something went wrong", error:{error}
      },{
        status:500
      })

      
  }
}