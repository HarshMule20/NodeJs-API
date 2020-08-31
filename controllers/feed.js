const { validationResult } = require('express-validator/check')

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                 _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                imageURl: 'images/image1.png',
                creator: {
                    name: 'Harsh'
                },
                createdAt: new Date()
            }
        ]
    });
};

exports.createPOsts = (req, res, next) => {
    // Create post in DB
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect.',
            errors: errors.array()
        })
    }
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        message: 'Post create successfully!',
        post: {
            _id: new Date().toISOString(),
            title : title,
            content : content,
            creator : {
                name: 'HarshMule',
            },
            createdAt : new Date()
        }
    });
};