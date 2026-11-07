import { connectdb } from "@/lib/dbconnection";
import { NextRequest } from "next/server";


async function POST(req:NextRequest) {
    try {
        await connectdb();

        
    } catch (error) {
        
    }
}