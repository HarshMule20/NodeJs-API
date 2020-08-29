const express = require('express');

const app = express();
const feedroutes = require("./routes/feed");
app.use('/feed', feedroutes)
app.listen(8080);