const express = require('express');
const bodyparser = require('body-parser');

const app = express();
const feedroutes = require("./routes/feed");

//app.use(bodyparser.urlencoded()); //x-www-form-urlencoded <form> for html parsing
app.use(bodyparser.json()); //application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedroutes)
app.listen(8080);