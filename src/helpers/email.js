const nodemailer = require("nodemailer")
const smtpTransport = require('nodemailer-smtp-transport')
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.PW_EMAIL, // generated ethereal password
  }
}));
exports.sendEmail = (email, username, link) => {
  return new Promise((resolve, reject) => {
    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Email Address for Zwallet",
      html: `
            <!DOCTYPE html>
<html>
<head>
<style>
* {
  box-sizing: border-box;
}

body {
  font-family: Arial;
  padding: 10px;
}
.content{
  background: #F9F9F9;
}
.header {
  padding: 30px;
  text-align: center;
  color:#E0E0E0;
}

.header h1 {
  font-size: 45px;
}
.row , footer{
  margin-left: 15%;
    margin-right: 15%;
}
.row{
    padding: 60px;
     padding-bottom: 45px;
    background-color: #FFFFFF;
}
.card {
  padding-bottom: 45px;
}
.card h2{
    font-weight: 500;
    font-size: 20px;
    color: #4f545c;
    letter-spacing: 0.27px;
}
p{
  color: #737f8d;
    font-size: 16px;
    line-height: 24px;
    text-align: justify;
}
.button{
  text-align: center;
  padding-bottom: 45px;
}
hr{
  width: 80%;
  color: rgb(110, 107, 107);
}
.btn{
  background:rgb(114, 137, 218);
  border: none;
    border-radius: 3px;
    color: #FFFFFF !important;
    padding: 15px 19px;
    text-decoration: none;
}
.warning p{
  margin-top: 50px;
  font-size: 14px;
}
footer{
    padding: 60px; text-align: center; color: #737f8d;
    font-size: 16px;
    line-height: 24px;
}
</style>
</head>
<body>

<div class="content">
<div class="header">
  <h1>Zwallet</h1>
</div>

<div class="row">
  <div class="leftcolumn">
    <div class="card">
      <h2>Hey ${username}</h2>
      <p>Thanks for registering for an account on Zwallet! Before we get started, we just need to confirm that this is you. Click
      below to verify your email address:</p>
    </div>
    <div class="button">
      <a class="btn" href="${link}">Verify Email</a>
    </div>
    <hr>
    <div class="warning">
      <p>
        Please do not reply to this email. This email is sent automatically and all replies are addressed to the address
        This email will be deleted by the system.
        
        You received this email because of your membership in the Zwallet app.
      </p>
    </div>
  </div>
</div>

<footer>
  Sent by zwallet • check our blog • @zwallet
  <br>
  Jl. Sukarno Hatta, Karangsoko, Trenaggalek Jawa Timur 66319
</footer>
</div>

</body>
</html>

            ` // html body
    }
    transporter.sendMail(message, (error, info) => {
      if (error) {
        // console.log('Error occurred');
        // console.log(error.message);
        // return process.exit(1);
        reject(error)
      } else {
        resolve(info)
      }
    });
  })
}