const Admin = require('../models/admin-model.js')
const bcrypt=require('bcrypt');
const sendEmail=require('../utils/sendEmail.js');
const createTokens =require('../utils/CreateTokens.js');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(404)
            .json({
                message: "admin credentials are missing",
                success: false
            })
    }
    
    try {
        const checkAdmin = await Admin.findOne({Username:username});
        if (checkAdmin) {
            return res.status(409)
                .json({
                    message: "Admin already exists",
                    success: false
                })
        }

        const OTP=Math.floor(1000 + Math.random() * 9000);
        const OTPExpiry=new Date(Date.now() + 5 * 60000);
        const emailStatus=sendEmail(email,OTP);
        if(!emailStatus){
            return res.status(500)
                    .json({
                        message: "Error in sending email",
                        success: false
                    })
        }

        const hashPassword= await bcrypt.hash(password,10);

        const createAdmin=await Admin.create({
            Username:username,
            email,
            password:hashPassword,
            OTP,
            OTPExpiry
        })

        if(!createAdmin){
            return res.status(500)
                .json({
                    message: "cannot create Admin",
                    success: false
                })
        }

        return res.status(201)
                .json({
                    message:"Admin is created successfully, please verify the email",
                    success:true
                })
    } catch (error) {
        return res.status(500)
                .json({
                    message:"Internal server error in registering admin",
                    error:error.message,
                    success:false
                })
    }



}

const verifyAdmin = async (req, res) => {
    const { email, code } = req.body;
    if (!email) {
        return res.status(404)
            .json({
                message: "email is missing",
                success: false
            })
    }

    if (!code) {
        return res.status(404)
            .json({
                message: "verification code is missing",
                success: false
            })
    }


    try {
        const getAdmin = await Admin.findOne({ email });
        if (!getAdmin) {
            return res.status(404)
                .json({
                    message: "couldn't find admin with the provided email",
                    success: false
                })
        }

        if (Date.now() > getAdmin.OTPExpiry) {
            getAdmin.OTPExpiry = null;
            getAdmin.OTP = null;
            await getAdmin.save();
            return res.status(410)
                .json({
                    message: "Otp has expired",
                    success: false
                })
        }

        if (code != getAdmin.OTP) {
            return res.status(401)
                .json({
                    message: "Otp not matched",
                    success: false
                })
        }

        const accessToken = createTokens(getAdmin._id);
        const refreshToken = createTokens(getAdmin._id);

        getAdmin.RefreshToken = refreshToken;
        getAdmin.isValidated = true;
        getAdmin.OTPExpiry = null;
        getAdmin.OTP = null;
        await getAdmin.save();


        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200)
            .cookie("AccessToken", accessToken, options)
            .json({
                message: "Admin is verified",
                data: getAdmin.Name,
                success: true
            })


    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in verification of code",
                Error: error.message,
                success: false
            })
    }


}


const adminProfile=async (req,res)=>{
    const adminId=req.Admin;
    if(!adminId){
        return res.status(404)
                .json({
                    message:"adminId is missing",
                    success:false
                })
    }

    try {

        const adminDetails=await Admin.findById(adminId.user_id).select("-password -RefreshToken -OTP -OTPExpiry");
        console.log(adminDetails)

        if(!adminDetails){
            return res.status(404)
                .json({
                    message:"Could not fine the admin details",
                    success:false
                })
        }

        return res.status(200)
                .json({
                    message:"User details fetched successfully",
                    data:adminDetails,
                    success:true
                })
        
    } catch (error) {
        return res.status(500)
            .json({
                message:"internal server error in getting the profile of admin",
                error:error.message,
                success:false
            })
    }
}

const adminLogin=async(req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return res.status(404)
                .json({
                    message:"credentials are missing",
                    success:false
                })
    }

    const getAdmin=await Admin.findOne({
        
        $and:[{Username:username},{isValidated:true}]
    
    })
    if(!getAdmin){
        return res.status(404)
                .json({
                    message:"admin not found",
                    success:false
                })
    }

    const checkPassword= await bcrypt.compare(password,getAdmin.password);

    if(!checkPassword){
        return res.status(401)
                .json({
                    message:"The password is incorrect",
                    success:false
                })
    }

    const AccessToken=createTokens(getAdmin._id);
    const RefreshToken=createTokens(getAdmin._id);

    const options={
        httpOnly:true,
        secure:true
    }

    getAdmin.RefreshToken=RefreshToken;
    await getAdmin.save();

    return res.status(200)
            .cookie("AccessToken",AccessToken,options)
            .json({
                message:"Admin has loggedin successfully",
                success:true
            })
}

const adminLogout=async(req,res)=>{
    const adminId=req.Admin

    if(!adminId){
        return res.status(404)
                .json({
                    message:"no one is logged in",
                    success:false
                })
    }

    const clearRefreshToken=await Admin.findOneAndUpdate({
        _id:adminId.user_id
    },{
        $set:{
            RefreshToken:null
        }
    },{
        new:true
    })

    if(!clearRefreshToken){
        return res.status(500),
                json({
                    message:"couldn't log out",
                    success:false
                })
    }

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
            .clearCookie("AccessToken",options)
            .json({
                message:"Admin is logged out",
                success:true
            })
}

const resend=async(req,res)=>{
    const email = req.body.email;

    if (!email) {
        return res.status(404)
            .json({
                message: "email is missing",
                success: false
            })
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 10 * 60000);
    try {
        const getAdmin = await Admin.findOne({ email: email }).select("-password -RefreshToken");

        if (!getAdmin) {
            return res.status(404)
                    .json({
                        message:"Admin not found for sending otp",
                        success:false
                    })
        }

        getAdmin.OTP=otp;
        getAdmin.OTPExpiry=otpExpiry;

        await getAdmin.save();

        const emailStatus=sendEmail(email,otp);
        if(!emailStatus){
            return res.status(500)
                    .json({
                        message:"Error in sending email. Please check you email",
                        success:false
                    })
        }

        return res.status(200)
                .json({
                    message:"Message has been send to your registerd email, please verify",
                    success:false
                })
    } catch (error) {
        return res.status(500)
                .json({
                    message:"Internal Server Error in resending the message",
                    error:error.message,
                    success: false
                })
    }
}

module.exports={register,verifyAdmin,adminProfile,adminLogin,adminLogout,resend}