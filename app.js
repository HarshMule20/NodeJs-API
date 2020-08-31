const express = require('express');
const bodyparser = require('body-parser');

const app = express();
const feedroutes = require("./routes/feed");

//app.use(bodyparser.urlencoded()); //x-www-form-urlencoded <form> for html parsing
app.use(bodyparser.json()); //application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');   // This is to allow any host to call the server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');  // This is to allow the specific methods to use by the server and client
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // This is the authentication part of the server and allow to send the content type!
    next();
});

app.use('/feed', feedroutes)
app.listen(8080);