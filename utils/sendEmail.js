const nodemailer = require("nodemailer");
const dns=require('dns');
const { text } = require('express');
const {promisify}=require('util')

const resolveMx=promisify(dns.resolveMx);

const validateEmail=(email)=>{
    emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const checkDomain= async(email)=>{
    const domain=email.split('@')[1];
    try {
        const addresses=await resolveMx(domain);
        if(addresses && addresses.length>1){
            return true
        }
        return false
    } catch (error) {
        return false
    }
}



const sendEmail=async(email,otp)=>{

    if(!validateEmail(email)){
        return false;
    }

    if(!(await checkDomain(email))){
        return false
    }


    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_PASSWORD,
        },
      });

      try {
        const info = await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: email, // list of receivers
            subject: "Verify Your Email Address - Your OTP Code Inside", // Subject line
            text:`Thank You for registering. Here is your OTP: ${otp}. This will expire in 5 minutes`, // plain text body
            html: `<b>Thank You for registering. Here is your OTP: ${otp}. This will expire in 5 minutes.</b>` // html body
          });

          return info.messageId;
      } catch (error) {
        return false
      }
}

module.exports=sendEmail