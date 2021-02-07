const userCtrl = {}
const User = require('../models/User');
const passport = require('passport');



userCtrl.renderSignupForm = (req, res) => {
    req.flash('registered', 'no message');
    res.redirect('/')
}

userCtrl.signup = async (req, res) => {
    const errors = [];
    const { name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        errors.push({text: 'Passwords do not match'})
    } 
    if (password.length < 4) {
        errors.push({text: "password must be at least 4 caracters"})
    }    
    if (errors.length > 0) {
        res.render('index', {errors, name, email})    
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'The email is already in use');
            res.redirect('/');
        } else {
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            res.redirect('/');
        }
    }

}
   
userCtrl.renderSigninForm = (req, res) => {
    req.flash('registered', null);
    res.redirect('/');
}

userCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/',
    failureFlash: true
});

userCtrl.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}



module.exports = userCtrl;