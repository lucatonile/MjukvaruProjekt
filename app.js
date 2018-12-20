const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const shell = require('shelljs');

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const bikesRouter = require('./routes/bikes');

require('./db.js');

const app = express();

const bfrScript = path.join(__dirname, 'bfr', 'bfr.py');
const pyEnv = path.join(__dirname, 'bfr', 'env', 'bin', 'python');

const pyOptions = {
  pythonPath: pyEnv,
  pythonOptions: ['-u'],
  scriptPath: 'bfr',
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/payload', (req, res, next) => {
  if(1) {
    shell.exec('bash reload2', function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });
  }

  res.send({status: 'nice!'});
})

const auth = require('./queries/authQueries');

// Public routes
app.use('/auth', authRouter);

// Private routes
app.use('/users', auth.validateUser, usersRouter);
app.use('/bikes', auth.validateUser, bikesRouter);

// Test routes
const testRouter = require('./routes/test');

app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.json()); // to sup  JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));

// TODO Should this be an environmental variable?
app.set('secretKey', 'nodeRestApi');

module.exports = app;
