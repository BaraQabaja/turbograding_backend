const nodemailer=require('nodemailer')

const sendEmail=async(options)=>{
// 1) Create transporter (service that will send email like "gmail","Mailgun", "mailtrap", "sendGrid")
const transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,// if secure false port = 587, if true port = 465
    secure:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
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