const { name } = require("ejs");
let mongooose = require("mongoose");
let bcrypt = require('bcrypt');
let Schema = mongooose.Schema;
let user = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 5, maxlength: 15 },
    age: { type: Number },
    phone: { type: Number },
    country: { type: String },
  },
  {
    timestamps: true,
  }
);



user.pre("save", function (next) {
    if (this.password && this.isModified("password")) {
      bcrypt.hash(this.password, 10, (err, hashed) => {
        if (err) next(err);
        this.password = hashed;
        return next();
      });
    } else {
      next();
    }
  });

  user.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password , this.password , (err , result) => {
      return cb(err , result);
    })
  }

module.exports = mongooose.model('User', user);