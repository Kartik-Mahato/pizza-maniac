const LocalStratergy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

function init(passport) {
    passport.use(new LocalStratergy({
        usernameField: 'email'
    }, async (email, password, done) => {

        // check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'No user exists!' });
        }

        // compare passwords
        bcrypt.compare(password, user.password)
            .then(match => {
                if (match) {
                    return done(null, user, { message: 'Logged in Successfully' });
                }
                return done(null, false, { message: "Invalid Credentials" });
            }).catch(err => {
                return done(null, false, { message: "Something went wrong!" });
            })
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        await User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = init;