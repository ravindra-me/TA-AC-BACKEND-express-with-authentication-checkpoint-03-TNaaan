var mongooose = require('mongoose');
var Schema= mongooose.Schema;
var bcrypt = require('bcrypt');


var emailVerify =  new Schema({
    email: {type:String , required:true},
    otp:{type:Number},
    startDate:{type:Number},
    endDate:{type:Number}
})

emailVerify.pre('save', (next)=> {
    console.log("hello save")
    if(this.otp) {
        bcrypt.hash(this.otp, 10, (err, hashed)=> {
            if(err) next(err);
            this.otp = hashed;
            next();
        })
    }else{
        next()
    }
})

emailVerify.methods.verifyOtp = function(otp, cb) {
    bcrypt.compare(otp, this.otp, (err, veryOtp)=> {
        return cb(err, veryOtp);
    })
}


module.exports = mongooose.model('EmailVerify', emailVerify);