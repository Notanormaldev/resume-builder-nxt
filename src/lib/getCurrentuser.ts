import { cookies } from "next/headers";
import { verifytoken } from "./jwt";


export async function getcurrentuser(){
    const cookiestore = await cookies();

    const token = cookiestore.get('token')?.value;

    if(!token) throw new Error("Token not found");

    const decode = verifytoken(token);

    if(!decode)  throw new Error("unauthorize");
    
    return decode.userId;
    
}