const mongoose=require('mongoose')

const orderSchema=mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    product_name:{
        type:String,
        required:true
    },
    product_image:{
        type:String,
        required:true
    },
    quantify:{
        type:Number,
        default:1
    },
    TotalPrice:{
        type:Number,
        required:true
    }
})

const userSchema=mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isValidated:{
        type:Boolean,
        default:false
    },
    OTP:{
        type:String,
    },
    expiryDate:{
        type:Date,
    },
    RefreshToken:{
        type:String,
        max:4
    },
    address:{
        type:String
    },
    cart:[orderSchema]
})

const User=mongoose.model('User',userSchema);

module.exports=User

