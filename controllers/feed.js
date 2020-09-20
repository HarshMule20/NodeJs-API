const { validationResult } = require('express-validator/check');
const { connect } = require('mongoose');
const fs = require('fs');
const Post = require('../models/post');
const User = require('../models/user');
const path = require('path');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
        })
        .then(posts => {
            res.status(200).json({ message: 'Fetched all posts successfully', posts: posts, totalItems: totalItems })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    // res.status(200).json({
    //     posts: [{
    //         _id: '1',
    //         title: 'First Post',
    //         content: 'This is the first post!',
    //         imageUrl: 'images/image1.png',
    //         creator: {
    //             name: 'Harsh'
    //         },
    //         createdAt: new Date()
    //     }]
    // });
};

exports.createPosts = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error
            // return res.status(422).json({
            //     message: 'Validation failed, entered data is incorrect.',
            //     errors: errors.array()
            // })
    }
    // Create post in DB
    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    post.save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'Post create successfully!',
                post: post,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            });
        }).catch(err => {
            // console.log(err)
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


exports.getonePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Post Fetched Successfully', post: post })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error
            // return res.status(422).json({
            //     message: 'Validation failed, entered data is incorrect.',
            //     errors: errors.array()
            // })
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('no file picked!');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not Authorized User');
                error.statusCode = 403;
                throw error;
            }
            if (imageUrl !== postId.imageUrl) {
                clearImage(post.imageUrl)
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })
        .then(result => {
            res.status(200).json({ message: 'post updated successfully', post: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            // Check the logged in user for authentication
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not Authorized User');
                error.statusCode = 403;
                throw error;
            }
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save()
        })
        .then(result => {
            res.status(200).json({ message: 'Post deleted successfully' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};



const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};