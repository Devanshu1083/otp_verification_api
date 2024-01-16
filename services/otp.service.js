const otpGenerator = require("otp-generator");
const crypto = require('crypto');
//secret key
const key = "firstapp1";
const emailServices = require('../services/emailer.service');
async function sendOtp(params,callback){
    const otp = otpGenerator.generate(
        4,{
            digits :true,
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        }
    );

    const otpTimeout = 3 * 60 * 1000;//3 minutes window for an otp
    const expires = Date.now() + otpTimeout;//time at which it will expire
    const data = `${params.email}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256",key).update(data).digest("hex");//hashing data using sha256 encryption and key
    const fullHash = `${hash}.${expires}`;
    var otpMessage = `Dear customer, ${otp} is the one time password for your login`;

    var model = {
        email:params.email,
        subject: "Registration otp",
        body: otpMessage
    };
    
    //sending email and checking for completion success and return hash to store to validate otp
    emailServices.sendEmail(model,(error,result)=>{
        if(error){
            return callback(error);
        }
        return callback(null,fullHash);
    })
}

async function verifyOTP(params,callback){
    let [hashValue,expires] = params.hash.split('.');//separate expires and hash value
    let now = Date.now();

    if(now > parseInt(expires)) return callback("OTP expired");

    let data = `${params.email}.${params.otp}.${expires}`;
    //console.log(data);
    let newCalculatedHash = crypto.createHmac("sha256",key).update(data).digest("hex");
    if(newCalculatedHash === hashValue){
        return callback(null,"Success");
    }
    else{
        return callback("Invalid OTP");
    }
}
module.exports = {
    sendOtp,
    verifyOTP
}