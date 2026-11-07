import { Types } from "mongoose";


export interface IPersonalInfo{
    fullname:string;
    email:string;
    mobile:string;
    location:string;
    github:String;
    linkdin:string;
    portfolio:string;
}


export interface IWorkExp{
    company:string;
    position:string;
    startdate:string;
    enddate:string;
    description:string

}

export interface IProjects{
    title:string;
    description:string;
    techStack:string[];
    githuburl:string;
    liveurl:string;

}

export interface IEducation{
    institute:string;
    degree:string;
    startdate:string;
    enddate:string;
}

export interface IResume{
    _id?:string;
    user_id: Types.ObjectId;
    title:string;
    summary:string;
    PersonalInfo:IPersonalInfo;
    WorkExp:IWorkExp[];
    skills:string[];
    Projects:IProjects[];
    Education:IEducation[];
    certifications?:string[];
    acheivements?:string[];
    createdAt?:Date;
    updatedAt?:Date;
}