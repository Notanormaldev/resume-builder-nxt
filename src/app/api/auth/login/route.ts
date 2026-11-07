import { connectdb } from "@/lib/dbconnection";
import { genratetokenjwt } from "@/lib/jwt";
import { usermodel } from "@/models/usermodel";
import { Apiresponse } from "@/types/apitype";
import { Loginbody } from "@/types/usertypes";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
       await connectdb();
     let body:Loginbody=await req.json();
   
     let {email,password}=body;
      if(!email||!password){
           return NextResponse.json<Apiresponse>({
             success:false,message:"All fields are required"
           },{
             status:400
           })
      }
   
     let isexisted = await usermodel.findOne({email})
   
     if(!isexisted){
       return NextResponse.json<Apiresponse>({
         success:false, message:"user not exist please register"
       },{
         status:404
       })
     }
     
     let matchpass = await isexisted.comparePass(password)
   
     if(!matchpass){
       return NextResponse.json<Apiresponse>({
         success:false, message:"invalid credtinals"
       },{
         status:401
       })
     }

     let token = genratetokenjwt({userId:isexisted._id.toString()})
     
     let response = NextResponse.json<Apiresponse>({
       success:true , message:"user login successfully",data:{
         user:{
           _id:isexisted._id,
           name:isexisted.name,
           email:isexisted.email
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
         console.log("login db error on post req",error);
         return NextResponse.json<Apiresponse>({
           success:false,message:"something went wrong", error:{error}
         },{
           status:500
         })  
     }
}