import mongoose from "mongoose";
import { IResume } from "@/types/resume.type";


const resumeschema = new mongoose.Schema<IResume>({
          user_id:{ 
            toUpperCaseype:mongoose.Types.ObjectId,
            ref:"users",
            require:true
          },
          title:{
            type:String,
            default:" "
          },
          summary:{
            type:String,
            default:" "
          },
           PersonalInfo:{
            type:{
            fullname:String,
            email:String,
            mobile:String,
            location:String,
            github:String,
            linkdin:String,
            portfolio:String
            },
            default:{}
           },
            WorkExp:{
                type:[{
                      company:String,
                      position:String,
                      startdate:String,
                      enddate:String,
                      description:String
                }],
                default:[]
            }, 
              Projects:{
                type:[{
                      title:String,
                      description:String,
                      techStack:[String],
                      githuburl:String,
                      liveurl:String
                }],
                default:[]
              },
              skills:{
                type:[String],
                default:[]
              },
              certifications:{
                type:[String],
                default:[]
              }



},{
    timestamps:true
})


export const resumemodel = mongoose.model('resume',resumeschema)