
export  interface Iuser{
         _id:string,
        name:string,
        email:string,
        password:string,
        createdAt?:Date,
        updatedAt?:Date,//? means if is not their  is okay 
        mobile:string
}
export  interface Registerbody{
    name:string,
    email:string,
    password:string,
    mobile:string       
}
export  interface Loginbody{
  
    email:string,
    password:string
  
}

export  interface JWTpaylod{
      userId:string,
      email?:string,
}