var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/User');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_KEY,
    clientSecret: process.env.SECRET_KEY,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile)
    let newUser = {
      name: profile.displayName,
      email: profile._json.email,
    };
    User.findOne({ email: profile._json.email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        User.create(newUser, (err, addedUser) => {
          if (err) return done(err);
          console.log(addedUser)
          return done(null, addedUser);
        });
      }else{
         return done(null, user);
      }
    });
  }
));

console.log(process.env.GOOGLE_SECRET_KEY)


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_KEY,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {

      let newUser = {
      name: profile.displayName,
      email: profile._json.email,
      };
      User.findOne({ email: profile.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(newUser, (err, addedUser) => {
            if (err) return done(err);
            console.log(addedUser);
            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done)=>{
  done(null, user.id)
})

passport.deserializeUser((id, done)=>{
  User.findById(id, (err, user)=>{
      done(err, user)
  })
})