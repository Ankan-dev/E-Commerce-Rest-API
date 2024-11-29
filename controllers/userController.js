const User = require('../models/user-model.js')
const sendEmail = require('../utils/sendEmail.js');
const createTokens = require('../utils/CreateTokens.js');
const bcrypt = require('bcrypt')

const Register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(404)
            .json({
                message: "Credentials are missing",
                success: false
            })
    }

    try {
        const checkUser = await User.findOne({ email: email });

        if (checkUser) {
            return res.status(409)
                .json({
                    message: "User already exists",
                    success: false
                })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const createUser = new User({ Name: name, email: email, password: hashPassword });
        await createUser.save();

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 5 * 60000);
        const setOTP = await User.findOneAndUpdate({
            email: email
        }, {
            $set: {
                OTP: otp,
                expiryDate: otpExpiry
            }
        },
            {
                new: true
            }
        )

        if (!setOTP) {
            return res.status(500)
                .json({
                    message: "Internal server error in setting otp in the database",
                    message: true
                })
        }
        const emailStatus = await sendEmail(email, otp);
        if (!emailStatus) {
            return res.status(500)
                .json({
                    message: "Internal server error has occured while sending email",
                    success: false
                })
        }

        return res.status(201)
            .json({
                message: "User created successfully.OTP has been send to the to registered email",
                success: true
            })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error has occured in register User",
                error: error.message,
                success: false
            })
    }


}



const verifyUser = async (req, res) => {
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
        const getUser = await User.findOne({ email });
        if (!getUser) {
            return res.status(404)
                .json({
                    message: "couldn't find user with the provided email",
                    success: false
                })
        }

        if (Date.now() > getUser.expiryDate) {
            getUser.expiryDate = null;
            getUser.OTP = null;
            await getUser.save();
            return res.status(410)
                .json({
                    message: "Otp has expired",
                    success: false
                })
        }

        if (code != getUser.OTP) {
            return res.status(401)
                .json({
                    message: "Otp not matched",
                    success: false
                })
        }

        const accessToken = createTokens(getUser._id);
        const refreshToken = createTokens(getUser._id);

        getUser.RefreshToken = refreshToken;
        getUser.isValidated = true;
        getUser.expiryDate = null;
        getUser.OTP = null;
        await getUser.save();


        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200)
            .cookie("AccessToken", accessToken, options)
            .json({
                message: "User is verified",
                data: getUser.Name,
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

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404)
            .json({
                message: "Credentials are missing",
                success: false
            })
    }

    try {
        const getUser = await User.findOne({ email });
        if (!getUser) {
            return res.status(404)
                .json({
                    message: "User not found",
                    success: false
                })
        }

        if (!getUser.isValidated) {
            return res.status(404)
                .json({
                    message: "User is registered but not validated",
                    success: false
                })
        }

        const ComparePassword = bcrypt.compare(password, getUser.password);

        if (!ComparePassword) {
            return res.status(401)
                .json({
                    message: "Wrong password",
                    success: false
                })
        }


        const accessToken = createTokens(getUser._id);
        const refreshToken = createTokens(getUser._id);
        const options = {
            httpOnly: true,
            secure: true
        }

        getUser.RefreshToken = refreshToken;
        await getUser.save()

        return res.status(200)
            .cookie("AccessToken", accessToken, options)
            .json({
                message: "User is loggedin successfully",
                data: getUser.Name,
                success: true
            })

    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in login-user",
                Error: error.message,
                success: false
            })
    }
}

const profile = async (req, res) => {
    const userId = req.User;
    if (!userId) {
        return res.status(404)
            .json({
                message: "user id is missing",
                success: false
            })
    }

    try {
        const userDetails = await User.findById(userId.user_id).select("-password -RefreshToken -OTP -expiryDate");

        if (!userDetails) {
            return res.status(404)
                .json({
                    message: "user profile not found",
                    success: false
                })
        }

        return res.status(200)
            .json({
                message: "user found successfully",
                data: userDetails,
                success: true
            })

    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in profile controller",
                error: error.message,
                success: false
            })
    }
}

const resendMessage = async (req, res) => {
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
        const getUser = await User.findOne({ email: email }).select("-password -RefreshToken");

        if (!getUser) {
            return res.status(404)
                    .json({
                        message:"User not found for sending otp",
                        success:false
                    })
        }

        getUser.OTP=otp;
        getUser.expiryDate=otpExpiry;

        await getUser.save();

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
                    success: false
                })
    }



}

const logoutUser=async (req,res)=>{
    const userId=req.User;
    if(!userId){
        return res.status(404),
                json({
                    message:"No user is logged in",
                    success:false
                })
    }

    const logoutUser=await User.findOneAndUpdate({
        _id:userId.user_id
    },{
        RefreshToken:null
    },{
        new:true
    })

    if(!logoutUser){
        return res.status(500)
                .json({
                    message:"couldn't logout",
                    success:false
                })
    }

    const Option={
        httpOnly:true,
        secure:true
    }

    res.status(200)
        .clearCookie("AccessToken",Option)
        .json({
            message:"User loggedout successfully",
            success:true
        })
}

module.exports = { Register, verifyUser, login, profile,resendMessage, logoutUser }