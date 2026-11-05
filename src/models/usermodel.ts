import { Iuser } from "@/types/usertypes";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface Userdocument extends Omit<Iuser,'_id'>, Document{
  comparePass(candidatePassword:string):boolean
}

let userSchema = new mongoose.Schema<Userdocument>({
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
    },
    mobile:{
        type:String,
        minlength:[10,"min length is 10"],
        maxlength:[10,"max length is 10"]
    },
    
},{
    timestamps:true
})

userSchema.pre("save",function():void{
    if(!this.isModified("password")) return 
    this.password = bcrypt.hashSync(this.password,10)
})

userSchema.methods.comparePass = function (candidatePassword:string) :boolean{
   return bcrypt.compareSync(candidatePassword, this.password)
}

export const usermodel = mongoose.model("Users",userSchema)