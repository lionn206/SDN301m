const express = require('express');

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const app = express();
const url = "mongodb://localhost:27017/conFusion";
const Dishes = require("./models/dishes");
const mongoose = require("mongoose");
const dishRouter = require('./routes/dishRouter');
const port = 3000;
const connect = mongoose.connect(url);
const cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);



connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);


app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

function auth (req, res, next) {
    console.log(req.session);

    if (!req.session.user) {
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');                        
            err.status = 401;
            next(err);
            return;
        }
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            req.session.user = 'admin';
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
        }
    }
    else {
        if (req.session.user === 'admin') {
            console.log('req.session: ',req.session);
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
}




app.use(auth);


app.use('/dishes', dishRouter);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});