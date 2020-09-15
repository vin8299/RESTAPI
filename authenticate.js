const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
//User.authenticate() method is provided by passport-local-mongoose and added to user schema
//thats why useful for authentication
//if you wish to use basic authentication then you can provide your own function

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
