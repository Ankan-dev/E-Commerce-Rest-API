const User = require('../models/user-model');
const Product = require('../models/product-model');

const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id=req.User.user_id

    if (!product_id) {
        return res.staus(404)
            .json({
                message: "product id is missing",
                success: false
            })
    }

    if (!user_id) {
        return res.staus(404)
            .json({
                message: "user id is missing",
                success: false
            })
    }

    try {
        const getProduct = await Product.findById(product_id).select("Product_name price image")

        if (!getProduct) {
            return res.status(404)
                .json({
                    message: 'cannot find the product',
                    success: false
                })
        }


        let TotalPrice = 0;
        if (quantity) {
            TotalPrice = TotalPrice + (quantity * parseFloat(getProduct.price));
        } else {
            TotalPrice = TotalPrice + parseFloat(getProduct.price);
        }

        const getUser = await User.findById(user_id);
        if (!getUser) {
            return res.staus(404)
                .json({
                    message: "User not found",
                    success: false
                })
        }

        const productInCart = {
            product: product_id,
            product_name:getProduct.Product_name,
            product_image:getProduct.image,
            quantify: quantity,
            TotalPrice: TotalPrice
        }

        getUser.cart.push(productInCart);
        await getUser.save();

        return res.status(200)
            .json({
                message: "The product has been added to the cart successfully",
                success: true
            })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error at adding the product",
                error:error.message,
                success: false
            })
    }



}

const getCartProducts=async(req,res)=>{
    const user_id=req.User.user_id;
    if (!user_id) {
        return res.staus(404)
            .json({
                message: "user id is missing",
                success: false
            })
    }

    try {

        const getCartProducts=await User.findById(user_id).select("cart")

        if(!getCartProducts){
            return res.status(500)
                    .json({
                        message:"could not fetch the cart data",
                        success:false
                    })
        }

        if(getCartProducts.length===0){
            return res.status(200)
                    .json({
                        message:"cart is empty",
                        success:true
                    })
        }

        return res.status(200)
            .json({
                message: "The cart data is fetched successfully",
                data:getCartProducts.cart,
                success: false
            })

        
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error at getting the products in the cart",
                error:error.message,
                success: false
            })
    }
}

const deleteProducts=async(req,res)=>{
    const user_id=req.User.user_id;
    const product_id=req.body.product_id

    if(!user_id){
        return res.staus(404)
            .json({
                message: "user id is missing",
                success: false
            })
    }


    if(!product_id){
        return res.status(404)
            .json({
                message: "product id is missing",
                success: false
            })
    }

    try {
        const getCartProducts=await User.findById(user_id).select("cart");

        if(!getCartProducts){
            return res.status(500)
                    .json({
                        message:"could not fetch the cart data",
                        success:false
                    })
        }

        const newCart=getCartProducts.cart.filter(obj=>obj.product.toString()!==product_id)
        getCartProducts.cart=newCart

        await getCartProducts.save();

        return res.status(200)
            .json({
                message: "The cart data is fetched successfully",
                data:getCartProducts.cart,
                success: false
            })

    } catch (error) {
        return res.status(500)
        .json({
            message: "Internal server error at deleting the product from the cart",
            error:error.message,
            success: false
        })
    }
}

module.exports={addToCart, getCartProducts,deleteProducts}