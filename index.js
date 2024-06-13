  const express = require('express');

  const MongoClient = require("mongodb").MongoClient;
  const assert = require("assert");
  const app = express();
  const url = "mongodb://localhost:27017/conFusion";
  const Dishes = require("./models/dishes.js");
  const mongoose = require("mongoose");
  const dishRouter = require('./routes/dishRouter');
  const port = 3000;
  const connect = mongoose.connect(url);
  const cookieParser = require('cookie-parser');
  var session = require('express-session');
  var FileStore = require('session-file-store')(session);
  const indexRouter = require('./routes/index.js');
  const usersRouter = require('./routes/userRouter.js');
  const passport = require('passport');
  const authenticate = require('./authentication.js');
  const config = require('./config/config.js');
  //const url = config.mongoUrl;
  app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
    }));
    
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use(auth);
  app.use('/dishes', dishRouter);

  connect.then(
    (db) => {
      console.log("Connected correctly to server");
    },
    (err) => {
      console.log(err);
    }
  );


  function auth (req, res, next) {
      console.log(req.user);
  
      if (!req.user) {
        var err = new Error('You are not authenticated!');
        err.status = 403;
        next(err);
      }
      else {
            next();
      }
  }
  app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
  });