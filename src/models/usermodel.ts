import mongoose from "mongoose";




let userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"name is require"]
    },
    email:{
          type:String,
        trim:true,
        required:[true,"email is require"],
        unique:true
    },
    password:{
      type:String,
      minlength:[6,"min characters is 6"],
        required:[true,"password is require"]
    }
    
})