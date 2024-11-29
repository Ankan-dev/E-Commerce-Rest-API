const Product = require('../models/product-model.js');
const { uploadtToCloudinary } = require('../utils/cloudinary.js');
const Collections=require('../models/collection-model.js')

const addProduct = async (req, res) => {
    const { Product_name, Product_description, price, collection_id } = req.body;
    if (!Product_name || !Product_description || !price) {
        return res.status(404)
            .json({
                message: "Important informations about the products are missing",
                success: false
            })
    }

    const productImageLocalPath = req.file?.path;
    console.log(productImageLocalPath);

    if (!productImageLocalPath) {
        return res.status(404)
            .json({
                message: "Image of the product is missing",
                success: false
            })
    }

    try {
        const upload = await uploadtToCloudinary(productImageLocalPath);

        

        const createProduct = await Product.create({
            Product_name,
            Product_description,
            price,
            image: upload.url,
            Collection:collection_id
        })


        if (!createProduct) {
            return res.status(500)
                .json({
                    message: "Failed to create the product",
                    success: false
                })
        }

        const updateCollection=await Collections.findOneAndUpdate({_id:collection_id},{$push:{
            products:createProduct._id
        }},{new:true})

        if(!updateCollection){
            return res.status(500)
            .json({
                message:"Couldn't update the collection ",
                success:false
            })
        }

        return res.status(201)
            .json({
                message: "Product has been created successfully",
                success: true
            })

    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in creating the product",
                error: error,
                success: false
            })
    }



}

const getProducts = async (req, res) => {
    try {
        const getProducts = await Product.find();
        if (!getProducts) {
            return res.status(204)
                .json({
                    message: "No product is present in the database",
                    success: false
                })
        }
        res.status(200)
            .json({
                message:"List of all the products are here",
                data:getProducts,
                success:true
            })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in getting the product",
                error: error,
                success: false
            })
    }
}

const updateProduct = async (req, res) => {
    const id=req.body?.id;
    const Title=req.body?.title;
    const desciption=req.body?.description;
    const price=req.body?.price

    if (!id) {
        return res.status(404)
            .json({
                message: "Product id is missing",
                success: false
            })
    }

    try {

        if (Title && !desciption && !price) {
            const updateProductDetails = Product.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        Product_name: Title,
                    }
                },
                {
                    new: true
                }
            )

            if (!updateProductDetails) {
                return res.status(500)
                    .json({
                        message: "having problem in updating the title",
                        success: false
                    })
            }

            return res.status(200)
                    .json({
                        message:"The tile has been updated successfully",
                        success:true
                    })
        } else if (desciption && !Title && !price) {

            const updateProductDetails = Product.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        Product_description: desciption
                    }
                },
                {
                    new: true
                }
            )

            if (!updateProductDetails) {
                return res.status(500)
                    .json({
                        message: "having problem in updating the description",
                        success: false
                    })
            }

            return res.status(200)
                    .json({
                        message:"The description has been updated successfully",
                        success:true
                    })

        } else if (price && !desciption && !Title) {
            const updateProductDetails = Product.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        price: price
                    }
                },
                {
                    new: true
                }
            )

            if (!updateProductDetails) {
                return res.status(500)
                    .json({
                        message: "having problem in updating the price",
                        success: false
                    })
            }

            return res.status(200)
                    .json({
                        message:"The price has been updated successfully",
                        success:true
                    })
        } else if (Title && desciption && !price) {
            const updateProductDetails = Product.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        Product_description: desciption
                    }
                },
                {
                    new: true
                }
            )

            if (!updateProductDetails) {
                return res.status(500)
                    .json({
                        message: "having problem in updating the description",
                        success: false
                    })
            }

            return res.status(200)
                    .json({
                        message:"The description has been updated successfully",
                        success:true
                    })

        } else if (price && !desciption && !Title) {
            const updateProductDetails = Product.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        price: price
                    }
                },
                {
                    new: true
                }
            )

            if (!updateProductDetails) {
                return res.status(500)
                    .json({
                        message: "having problem in updating the price",
                        success: false
                    })
            }

            return res.status(200)
                    .json({
                        message:"The price has been updated successfully",
                        success:true
                    })
        } else if (Title && !desciption && price) {
            const updateProductDetails = Product.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        Product_name: Title,
                        price: price
                    }
                },
                {
                    new: true
                }
            )

            if (!updateProductDetails) {
                return res.status(500)
                    .json({
                        message: "having problem in updating the price",
                        success: false
                    })
            }

            return res.status(200)
                    .json({
                        message:"The price has been updated successfully",
                        success:true
                    })
            
        } else if (Title && !desciption && !price) {
            const updateProductDetails = Product.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        Product_name: Title,
                        Product_description: desciption
                    }
                },
                {
                    new: true
                }
            )

            if (!updateProductDetails) {
                return res.status(500)
                    .json({
                        message: "having problem in updating the title and descripion",
                        success: false
                    })
            }

            return res.status(200)
                    .json({
                        message:"The title and descripion has been updated successfully",
                        success:true
                    })
        } else if (!Title && desciption && price) {
            const updateProductDetails = Product.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        price: price,
                        Product_description: desciption
                    }
                },
                {
                    new: true
                }
            )

            if (!updateProductDetails) {
                return res.status(500)
                    .json({
                        message: "having problem in updating the price and descripion",
                        success: false
                    })
            }

            return res.status(200)
                    .json({
                        message:"The title and descripion has been price successfully",
                        success:true
                    })
        } else {

        }
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in updating the product",
                error: error,
                success: false
            })
    }

}

const deleteProduct=async (req,res)=>{
    const id=req.body.id;
    if(!id){
        return res.status(404)
            .json({
                message: "The product id is missing",
                success: false
            })
    }

    try {
        const deleteProduct=await Product.deleteOne({_id:id});
        if(!deleteProduct){
            return res.status(500)
                    .json({
                        message:"The product can't be deleted",
                        success:false
                    })
        }  

        return res.status(200)
                .json({
                    message:"The product has been deleted successfulle",
                    success:true
                })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in deleting the product",
                error: error,
                success: false
            })
    }

    
    
}


module.exports = { addProduct, getProducts, updateProduct, deleteProduct }