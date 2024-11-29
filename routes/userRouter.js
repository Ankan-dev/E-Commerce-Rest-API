const express=require('express')
const router=express.Router();
const {Register, verifyUser, login, profile,resendMessage, logoutUser}=require('../controllers/userController.js');
const userAuthentication=require('../middlewares/auth.js')

router.post('/register-user',Register)
router.post('/verify-user',verifyUser)
router.post('/login-user',login)
router.get('/profile-user',userAuthentication,profile)
router.post('/logout-user',userAuthentication,logoutUser)
router.post('/resend-email-user',resendMessage)

module.exports=router