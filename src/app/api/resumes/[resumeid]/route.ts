import { getcurrentuser } from "@/lib/getCurrentuser";
import { resumemodel } from "@/models/resumemodel";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest,
    {params}:{params:Promise<{resumeId:string}>}
){ 
     try {

        const user = await getcurrentuser();

        const {resumeId}=await params;


        const resume = await resumemodel.findOne({
            _id:resumeId,
            user_id:user.userId

        })

        if(!resume){
            return NextResponse.json<Apiresponse>({
                success:false,
                message:"no resume found "
             },{status:404})
        }

          return NextResponse.json<Apiresponse>({
                success:true,
                message:"resume found ",
                data:resume
             },{status:200})
        
     } catch (error) {
           console.log("error in get resume api",error);
                        return NextResponse.json<Apiresponse>({
                            success:false,
                            message:"something wrong in get resume api ",error:{error}
                
                        },{status:500})
     }
}

export async function PATCH(req:NextRequest,
    {params}:{params:Promise<{resumeId:string}>}
){ 
     try {

        const user = await getcurrentuser();
        const body=await req.json();
        const {resumeId}=await params;


        const updatedresume = await resumemodel.findOneAndUpdate({
            _id:resumeId,
            user_id:user.userId

        },{
            $set:body
        },{
           new:true,
           runValidators:true
        })

        if(!updatedresume){
            return NextResponse.json<Apiresponse>({
                success:false,
                message:"updated resume failed "
             },{status:400})
        }

          return NextResponse.json<Apiresponse>({
                success:true,
                message:"resume updated ",
                data:updatedresume
             },{status:200})
        
     } catch (error) {
           console.log("error in update resume api",error);
                        return NextResponse.json<Apiresponse>({
                            success:false,
                            message:"something wrong in updateed resume ",error:{error}
                
                        },{status:500})
     }
}