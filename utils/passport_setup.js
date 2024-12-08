const passport = require('passport');
const UserModel = require('../models/user');
const { generateHashedId } = require('./lib');

const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.algorithms = ["RS256"]
opts.issuer = "dev.MoAozKe.com";
opts.audience = "resport.com";

const strategy = new JwtStrategy(opts, function (jwt_payload, done) {
    UserModel.findOne({ _id: jwt_payload["_id"], role: jwt_payload["role"] }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })


module.exports = (passport) => {
  passport.use(strategy)
}


