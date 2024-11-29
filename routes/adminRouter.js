const express=require('express')
const Router=express.Router();
const {register,verifyAdmin,adminProfile,adminLogin,adminLogout,resend}=require('../controllers/adminController.js')
const authenticateAdmin=require('../middlewares/adminAuth.js');


Router.post('/register-admin',register)
Router.post('/verify-admin',verifyAdmin);
Router.get('/admin-profile',authenticateAdmin,adminProfile);
Router.post('/admin-login',adminLogin);
Router.post('/admin-logout',authenticateAdmin,adminLogout)
Router.post('/resend-otp-admin',resend);

module.exports=Router;