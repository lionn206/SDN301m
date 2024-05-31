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

connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);
app.use('/dishes', dishRouter);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});