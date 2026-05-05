const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const DataBase = require("./models/db");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const session = require('express-session');

const indexRouter = require('./routes/index');
const entryRouter = require('./routes/entry');
const profileRouter = require('./routes/profile');
const registerRouter = require('./routes/register');
const articlePageRouter = require('./routes/articlePage');
const usersRouter = require('./routes/users');
const articleVisualRouter=require('./routes/articleVisual');
const loginRouter = require('./routes/login');

const app = express();
const port = 3000;

// configure session
app.use(session({
  secret: 'bmw',
  resave: false,
  saveUninitialized: true
}));

// uses passport for initialize
app.use(passport.initialize());
app.use(passport.session());

//transform session
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/entry', entryRouter);
app.use('/profile', profileRouter);
app.use('/articlePage', articlePageRouter);
app.use('/register', registerRouter);
app.use('/users', usersRouter);
app.use('/articleVisual', articleVisualRouter);
app.use('/login', loginRouter);

// authentication method
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function (email, password, done) {
  try {
      const user = await db.findUserByEmail(email);
      if (!user) return done(null, false);

      bcrypt.compare(password, user.password, function (err, result) {
          if (err) return done(err);
          if (result) return done(null, user);
          else return done(null, false);
      });
  } catch (err) {
      console.error("Error finding user by email:", err);
      return done(err);
  }
}));

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(async function (email, done) {
  try {
      const user = await db.findUserByEmail(email);
      user.id = user.ID;
      done(null, user);
  } catch (err) {
      console.error("Error finding user by email:", err);
      done(err);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});




