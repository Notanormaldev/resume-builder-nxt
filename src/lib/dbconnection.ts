import mongoose from "mongoose";


export let connectdb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("mongo connected");
        
    } catch (error) {
        console.log("error in connection db",error);
        throw error
            }
}