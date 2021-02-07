const path = require('path');
const fs = require('fs-extra');
const md5 = require('md5');
const cloudinary = require('cloudinary');
const { cloud } = require('../helpers/libs');

const { Image, Comment } = require('../models');
const sidebar = require('../helpers/sidebar');

cloudinary.cloud;


const ctrl = {};


ctrl.index = async (req, res) => {
    let viewModel = {image: {}, comments: {}};
    const image = await Image.findOne({filename : {$regex: req.params.image_id}});
    if (image) {
        image.views += 1;
        viewModel.image = image;
        await image.save();
        const comments = await Comment.find({image_id: image._id}).sort({timestamp: -1});
        viewModel.comments = comments;
        viewModel = await sidebar(viewModel);
        res.render('image', viewModel);
    } else {
        res.redirect('/')
    }

};


ctrl.create = async (req, res) => {

    const {title, description} = req.body;
    const ext = path.extname(req.file.originalname);
    if(ext === '.jpg' || ext === '.jpeg' || ext === '.png' | ext === '.gif') {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {folder: 'imgshare'});
        const newImage = new Image({
            userId: req.user.id,
            title, 
            description,
            filename: result.original_filename,
            imageUrl: result.secure_url,
            public_id: result.public_id
        });
        const imageSeved = await newImage.save();
        await fs.unlink(req.file.path);
        res.redirect('/images/' + imageSeved.uniqueId)
    } else {
        res.status(500).send('File must be an image')
    }
};

ctrl.getUserImages = async (req, res) => {
    let viewModel = {images: {}}
    const{ id } = req.params
    const images = await Image.find({userId: id})
    viewModel.images = images;
    viewModel = await sidebar(viewModel)
    res.render('userImages', viewModel)
}


ctrl.like = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if(image) {
        image.likes = image.likes +1;
        await image.save()
        res.json({likes: image.likes})
    } else {
        res.status(500).json({error: 'Internal Error'})
    }
};

ctrl.comment = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if (image) {
        const newComment = await new Comment(req.body)
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        await newComment.save();
        res.redirect('/images/' + image.uniqueId)
    } else {
        res.redirect('/')
    }
};

ctrl.remove = async (req, res) => {
    const image = await Image.findOne({filename: req.params.image_id});
    if (image && image.userId === req.user.id) {
        await cloudinary.v2.uploader.destroy(image.public_id);
        await Comment.deleteOne({image_id: image._id})
        await image.remove();
        req.flash('succes_msg', `The image has been deleted`)
        return res.render('userImages')
    } else {
        res.json({message: 'Bad request'})
    }
};


module.exports = ctrl;