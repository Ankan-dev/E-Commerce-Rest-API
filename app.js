require('dotenv').config({path:'.env'})
const express=require('express')
const dbConnect=require('./database/dbConnect.js')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const userRouter=require('./routes/userRouter.js')
const collectionRouter=require('./routes/collectionRouter.js');
const productRouter=require('./routes/productRouter.js');
const adminRouter=require('./routes/adminRouter.js')
const cartRouter=require('./routes/cartRouter.js');

const app=express()
const port=process.env.PORT || ''


app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(cors({
    origin:'*',
    credentials:true
}))
app.use(cookieParser())



app.use('/app/user',userRouter);
app.use('/app/collection',collectionRouter);
app.use('/app/product',productRouter);
app.use('/app/admin',adminRouter);
app.use('/app/cart',cartRouter);
app.get('/',(req,res)=>{
    res.status(200).send("Welcome to e-commerce-api");
})


dbConnect();
app.listen(port,()=>{
    console.log(`The server is running at port ${port}`)
})