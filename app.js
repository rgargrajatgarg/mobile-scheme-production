var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var schemeRouter = require('./routes/scheme');
var uploadRouter = require('./routes/upload');
var app = express();
mongoose.connect(process.env.DB_CONNECT,(err)=>{
  if(err) {
      console.error(err);
  } else {
      console.log("Connected to DB");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.bodyParser({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use('/users', usersRouter);
app.use('/scheme',schemeRouter);
app.use('/upload',uploadRouter);

//uncomment below code when pushing to build
app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
