const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    // Match email's user
    const user = await User.findOne({email})
    if (!user) {
        return done(null, false, { message: 'User not found'});
    } else {
        // match password's user
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect user or password'});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
});