const jwt=require('jsonwebtoken')

const userAuthentication= async(req,res,next)=>{
    const token=req.cookies?.AccessToken;

    if(!token){
        return res
                .status(404)
                .json({
                    message:"token is missing",
                    success: false
                })
    }

    const userId=jwt.verify(token,process.env.JWT_SECRET);

    req.User=userId;
    next();

}

module.exports=userAuthentication