const express=require('express');
const {addProduct,getProducts, updateProduct, deleteProduct}=require('../controllers/productController.js')
const upload=require('../middlewares/multer.js')
const authenticateAdmin=require('../middlewares/adminAuth.js');

const Router=express.Router();

Router.post('/add-product',authenticateAdmin,upload.single('Product'),addProduct)

Router.get('/get-product',getProducts);
Router.post('/update-products',authenticateAdmin,updateProduct);
Router.delete('/delete-product',authenticateAdmin,deleteProduct);

module.exports=Router