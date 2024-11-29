const mongoose=require('mongoose')

const collectionSchema=mongoose.Schema({
    Title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]
});

const Collections=mongoose.model("Collections",collectionSchema);

module.exports=Collections;