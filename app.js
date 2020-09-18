const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const app = express();

const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const feedroutes = require("./routes/feed");
const authroutes = require('./routes/auth');

//app.use(bodyparser.urlencoded()); //x-www-form-urlencoded <form> for html parsing
app.use(bodyparser.json()); //application/json

app.use(multer({ storage: filestorage, fileFilter: fileFilter }).single('image'))

// for the connection of the static folders like images etc
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // This is to allow any host to call the server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // This is to allow the specific methods to use by the server and client
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // This is the authentication part of the server and allow to send the content type!
    next();
});

app.use('/feed', feedroutes);
app.use('/auth', authroutes);

// error handling 
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500; //this sign (||) is for giving default value  
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
})

mongoose.connect('mongodb://localhost:27017/post_feed', { useNewUrlParser: true }).then(result => {
    console.log("Success");
    app.listen(8080);
}).catch(err => {
    console.log(err);
})