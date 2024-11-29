const express=require("express")
const {addToCart,getCartProducts,deleteProducts}=require('../controllers/cartController.js');
const userAuthentication=require('../middlewares/auth.js');



const Router=express.Router();

Router.post('/add-to-cart',userAuthentication,addToCart)
Router.get('/get-cart-products',userAuthentication,getCartProducts)
Router.post('/delete-cart-products',userAuthentication,deleteProducts)

module.exports=Router