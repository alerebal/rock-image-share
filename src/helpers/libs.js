const helpers = {};
const cloudinary = require('cloudinary');

helpers.cloud = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = helpers;