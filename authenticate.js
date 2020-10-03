const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); 

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
//User.authenticate() method is provided by passport-local-mongoose and added to user schema
//thats why useful for authentication
//if you wish to use basic authentication then you can provide your own function

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    //sign method have 3 params(user, secret key for encoding, other features)
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

var opts = {}
//Extracting from request message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
        (jwt_payload, done) => {
            console.log("JWT payload", jwt_payload);
            User.findOne({_id : jwt_payload._id}, (err, user) => {
                if(err){
                    return done(err, false)
                }
                else if(user){
                    return done(null, user)
                }
                else{
                    return done(null,false)
                }
            })
        }));
exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        var err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
};