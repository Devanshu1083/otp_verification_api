var nodemailer = require('nodemailer');

async function sendEmail(params,callback){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: '',
            pass: ''
        }
    });
    //contents of mail
    var mailOptions = {
      from: 'dummyapp@gmail.com',// email name from which mail is recieved by user
      to : params.email,
      subject : params.subject,  
      text : params.body,
    };
    //sending the mail
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            return callback(error);
        }
        else{
            return callback(null,info.response)
        }
    });
}
module.exports = {
    sendEmail
}
