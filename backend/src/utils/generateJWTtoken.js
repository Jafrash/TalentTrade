import jwt from "jsonwebtoken";

const generateJWTToken_email=(user)=>{
    console.log("\n******** Inside generateJWTToken_email ********\n");
    const payload={
        id:user._id,
        email:user.email
    };
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"});
};
const generateJWTToken_username=(user)=>{
    console.log("\n******** Inside generateJWTToken_username ********\n");

    const payload={
        id:user._id,
        username:user.username
    };
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"});
};

export {generateJWTToken_email,generateJWTToken_username};