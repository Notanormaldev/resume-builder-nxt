import { connectdb } from "@/lib/dbconnection";
import { getcurrentuser } from "@/lib/getCurrentuser";
import { resumemodel } from "@/models/resumemodel";
import { Apiresponse } from "@/types/apitype";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {

        await connectdb();
        
        const userid = await getcurrentuser();

    const newresume = await resumemodel.create({
                user_id:userid,
                title:"",
                summary:"",
                PersonalInfo:{},
                WorkExp:[],
                skills:[],
                Projects:[],
                Education:[],
                certifications:[],
                acheivements:[]
            
        })
        return NextResponse.json<Apiresponse>({
            success:true,
            message:"Resume created successfully",data:newresume

        },{status:201})
    } catch (error) {
        console.log("error in create resume",error);
        return NextResponse.json<Apiresponse>({
            success:false,
            message:"something wrong in creating resume",error:{error}

        },{status:500})
    }
}