require('dotenv').config({ silent: true });

const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon')
const logger = require('morgan');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejsLayouts = require('express-ejs-layouts');
const passport = require('./config/ppConfig');
const session = require('express-session');
const flash = require('connect-flash');
const isLoggedInAdmin = require('./middleware/isLoggedInAdmin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(ejsLayouts);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // cookie will only be set over HTTPS
    secure: true,
    // cookie expires every 600 ms === 10 min and user will have to log back in
    maxAge: 600000,
  },
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  // currentUser and alerts can be accessed on the front-end
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/api/users', isLoggedInAdmin, require('./routes/api/users'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
