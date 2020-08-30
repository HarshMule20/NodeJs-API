exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                title: 'First Post',
                content: 'This is the first post!'
            }
        ]
    });
};

exports.createPOsts = (req, res, next) => {
    // Create post in DB
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        message: 'Post create successfully!',
        post: {
            id: new Date().toISOString(),
            title : title,
            content : content 
        }
    });
};