const router = require('express').Router();

const home = require('../controllers/home');
const image = require('../controllers/image');
const user = require('../controllers/user');

const { isAuthenticated } = require('../helpers/auth');

module.exports = app => {

    router.get('/', home.index);
    router.get('/images/:image_id', image.index);
    router.get('/users/signup', user.renderSignupForm);
    router.get('/users/signin', user.renderSigninForm);
    router.get('/users/logout', user.logout);
    router.get('/users/images/:id', image.getUserImages);

    router.post('/images', image.create);
    router.post('/images/:image_id/like', image.like);
    router.post('/images/:image_id/comment', image.comment);
    router.post('/users/signup', user.signup);
    router.post('/users/signin', user.signin);
    router.delete('/images/:image_id', image.remove);

    app.use(router);
};