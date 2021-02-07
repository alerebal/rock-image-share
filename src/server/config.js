const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const errorHandler = require('errorhandler');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



const routes = require('../routes/index.routes');

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


module.exports = app => {

    require('../config/passport');
    
    // Settings
    app.set('port', process.env.PORT || 3300)
    app.set('views', path.join(__dirname, '../views'))
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        partialsDir: path.join(app.get('views'), 'partials'),
        layoutsDir: path.join(app.get('views'), 'layouts'),
        extname: '.hbs',
        helpers: require('./helpers')
    }))
    app.set('view engine', '.hbs');
    
    // Middlewares
    app.use(morgan('dev'));
    app.use(multer({
        dest: path.join(__dirname, '../public/upload')
    }).single('image'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    // Global Variables
    app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.registered = req.flash('registered');
    // res.locals.sidebar = req.flash('sidebar');
    next();
});
    
    // Routes
    routes(app);
    
    // Static files
    app.use('/public',express.static(path.join(__dirname, '../public')));
    
    // Errorhandlers
    if ('development' === app.get('env')) {
        app.use(errorHandler);
    }
    
    return app;
}