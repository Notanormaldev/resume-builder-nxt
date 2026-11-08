
import jwt from 'jsonwebtoken'
import { JWTpaylod } from "@/types/usertypes";


export const genratetokenjwt=(payload:JWTpaylod):string=>{
    return jwt.sign(payload,process.env.JWT_SECRET!,{
        expiresIn:"1h"
    })
}


export const verifytoken=(token:string):any=>{
    return jwt.verify(token,process.env.JWT_SECRET!)
}