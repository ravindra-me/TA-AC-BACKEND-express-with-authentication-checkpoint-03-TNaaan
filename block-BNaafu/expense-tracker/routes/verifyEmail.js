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

router.get("/:id/verifyOtp", (req, res, next) => {
  EmailVerify.findById(req.params.id, (err, content) => {
    if (err) return next(err);
    res.render("verifyOtp", {
      error: req.flash("error"),
      data: content,
      id: content._id,
    });
  });
});

router.post("/", (req, res, next) => {
  let otp = generateOTP();
  req.body.otp = String(otp);
  req.body.startDate = date();
  req.body.endDate = date() * 5 * 60 * 1000;
  EmailVerify.create(req.body, (err, content) => {
    if (err) return next(err);
    var mailOptions = {
      from: "ravindrarajpoot9628172@gmail.com",
      to: `${req.body.email}`,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>", // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log(req.body.email);
      res.redirect("/verifyEmail/" + content._id + "/verifyOtp");
    });
  });
});

router.post("/:id/verifyOtp", (req, res, next) => {
  let otp = req.body.otp;
  console.log("hi");
  EmailVerify.findById(req.params.id, (err, content) => {
    if (err) return next(err);
    if (content.endDate >= date()) {
      content.verifyOtp(otp, (err, verifyotp)=>{
        if(err) return next(err)
        console.log(verifyotp, "verify")
        if(!verifyotp) {
          req.flash("error", "opt is incorrect")
          return res.redirect("/verifyEmail/" + content._id + "/verifyOtp");
        }
        res.redirect("/verifyEmail/" + content._id + "/signup");
      })
    } else {
      req.flash("error", "your otp have expired");
      return res.redirect("/verifyEmail/" + content._id + "/verifyOtp");
    }
  });
});

router.get("/:id/signup", (req, res, next) => {
  EmailVerify.findById(req.params.id, (err, content) => {
    if (err) return next(err);
    res.render("signup", { data: content });
  });
});

module.exports = router;
