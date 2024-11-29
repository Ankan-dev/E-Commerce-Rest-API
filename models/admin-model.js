const mongoose=require('mongoose');

const adminSchema=mongoose.Schema({
    Username:{
        type:String,
        required:true,
        min:5,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    RefreshToken:{
        type:String,
        default:null
    },
    OTP:{
        type:String,
        default:null
    },
    OTPExpiry:{
        type:Date
    },
    isValidated:{
        type:Boolean,
        default:false
    }
})

const Admin=mongoose.model("Admin",adminSchema);

module.exports=Admin;