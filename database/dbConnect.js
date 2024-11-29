const mongoose =require('mongoose');

const dbConnect= async()=>{
    try {
        const db= await mongoose.connect(`${process.env.MONGO_URI}/E-commerce-Db` || '')
        if(db){
            console.log("Database is connected successfully")
        }
    } catch (error) {
        console.log("Connection to database is failed: ",error.message);
    }
}

module.exports=dbConnect