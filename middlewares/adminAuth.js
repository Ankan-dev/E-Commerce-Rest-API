const jwt=require('jsonwebtoken')

const authenticateAdmin=async (req,res,next)=>{
    const token=req.cookies?.AccessToken;

    if(!token){
        return res.status(404)
                .json({
                    message:"Token is missing",
                    success:false
                })
    }

    const admin_id=jwt.verify(token,process.env.JWT_SECRET);

    req.Admin=admin_id;

    next();

}

module.exports=authenticateAdmin;