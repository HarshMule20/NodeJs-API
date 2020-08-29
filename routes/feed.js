const express  = require('express');
const router = express.Router();
const feedcontroller = require('../controllers/feed');

router.get('/posts', feedcontroller.getPosts)
module.exports = router;ß