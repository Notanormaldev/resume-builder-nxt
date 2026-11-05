import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { JWTpaylod } from "@/types/usertypes";

const genratetokenjwt=(payload:JWTpaylod):string=>{
    return jwt.sign(payload,process.env.JWT_SECRET!,{
        expiresIn:"1h"
    })
}