const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const mongoongoose = require('mongoose');
const User = require('../models/User');

module.exports= function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/google/callback'
    },
    async (accessToken,refreshToken,profile,done)=>{
        console.log(profile);
        const newUser= {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        };
        try {
            let user = await User.findOne({googleId: profile.id})
            if(user){

                //console.log(User.findOne({googleId: profile.id}));
                done(null,user);
            }
            else{
                user = await User.create(newUser);
                console.log("NEW");
            done(null,user);
            } 
            
        } catch (err) {
            console.log(err);
        }
    }));
    passport.serializeUser((user, done) => done(null, user.id)  );


    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}