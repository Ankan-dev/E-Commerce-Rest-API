const jwt=require('jsonwebtoken')

const createTokens=(id)=>{
    if(!id){
        return false
    }
    return jwt.sign({user_id:id},process.env.JWT_SECRET);
}

module.exports=createTokens;