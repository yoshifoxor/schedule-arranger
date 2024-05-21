const createError = require('http-errors');
const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet')
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();

const GitHubStrategy = require('passport-github2').Strategy;
const GITHUB_CLIENT_ID = process.env.CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.CLIENT_SECRET;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/auth/github/callback',
    }, (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
));

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter= require('./routes/logout')

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
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
