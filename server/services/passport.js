const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const usernameGenerator = require("../user-utility/username-generator");
const words = require("../user-utility/words-store");
const keys = require("../config/dev");

const User = mongoose.model("chatUsers");


passport.serializeUser((user,done) => {
    done(null, user.id)
})


passport.deserializeUser( async (id, done) => {
    
    const user = await User.findById(id)

    done(null, user)
})


passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {

        try {
            const userRecord = await User.findOne({ googleId: profile.id })

            if(userRecord) {
                return done(null, userRecord)
            }

            let randomUserName = usernameGenerator(words)

            const userCreated = await User({ 
                googleId: profile.id, 
                userName: randomUserName,
                userIsOnline: true
            }).save()

            return done(null, userCreated)
        
        } catch {
            console.log("something went wrong during authentication with Google")
        }
    }
))
