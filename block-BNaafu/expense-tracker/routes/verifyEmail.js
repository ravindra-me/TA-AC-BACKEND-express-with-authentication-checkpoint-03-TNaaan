let express = require("express");
let router = express.Router();
let nodemailer = require("nodemailer");
let EmailVerify = require("../models/EmailVerify");

function date() {
  return Date.now();
}

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 9);
  }
  return otp;
}

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 3000,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/", (req, res) => {
  res.render("verifyEmail");
});

router.post("/", (req, res, next) => {
  req.body.otp = generateOTP();
  req.body.startDate = date();
  req.body.endDate = date() * 5 * 60 * 1000;
  

  EmailVerify.create(req.body, (err, content) => {

    if (err) return next(err);
    console.log("hi")
    var mailOptions = {
      from: "ravindrarajpoot9628172@gmail.com",
      to: `${req.body.email}`,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        generateOTP() +
        "</h1>", // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
     res.render("verifyOtp", { email: req.email });
    });
  });
});


router.post("/verifyOtp", (req, res, next) => {
  console.log(otp, "hi");
});

module.exports = router;
