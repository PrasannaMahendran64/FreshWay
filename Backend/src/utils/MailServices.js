
const nodemailer = require('nodemailer')
require('dotenv').config();

const user_mail = process.env.MAIL_USER
const mail_pass_key = process.env.MAIL_PASS_KEY


const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:user_mail,
        pass:mail_pass_key
    }
})


const mail = async (userEmail,otp)=>{
    const mailOptions = {
        from:user_mail,
        to:userEmail,
        subject:"OTP Verification",
        text:`To verify enter the below otp:${otp}`
    }

    await transport.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log("err",err)
        }
         console.log("info", info.response)
    })
}

module.exports=mail