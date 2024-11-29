const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    Product_name:{
        type:String,
        required:true
    },
    Product_description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    Collection:
        {
            type:mongoose.Schema.Types.ObjectId,
        }
    

})

const Product=mongoose.model("Product",productSchema);
module.exports=Product