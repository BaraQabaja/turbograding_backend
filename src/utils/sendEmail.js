const nodemailer=require('nodemailer')
const config = require("../config");

const sendEmail=async(options)=>{
// 1) Create transporter (service that will send email like "gmail","Mailgun", "mailtrap", "sendGrid")
const transporter=nodemailer.createTransport({
    host:config.email.email_host,
    port:config.email.email_port,// if secure false port = 587, if true port = 465
    secure:true,
    auth:{
        user:config.email.email_user,
        pass:config.email.email_password
    }
})
// 2) Define email options (like from, to, subject, content)
const mailOpts={
    from:'TurboGrading website <bqubaja@turbograding.com>',
    to:options.email,
    subject:options.subject,
    html:options.content
}
// 3) Send email
await transporter.sendMail(mailOpts)
}

module.exports=sendEmail;