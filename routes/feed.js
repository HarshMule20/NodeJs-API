const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const feedcontroller = require('../controllers/feed');
const isauth = require('../middleware/is-auth');

router.get('/posts', isauth, feedcontroller.getPosts);

router.post('/post', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], isauth, feedcontroller.createPosts);

router.get('/post/:postId/', isauth, feedcontroller.getonePost);

router.put('/post/:postId', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], isauth, feedcontroller.updatePost);

router.delete('/post/:postId', isauth, feedcontroller.deletePost);

module.exports = router;