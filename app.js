const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// usa bcryptjs
const bcrypt = require('bcryptjs');

const session = require('express-session');

const DataBase = require('./models/db');

// CREA IL DATABASE CUSTOM
const db = new DataBase();

const indexRouter = require('./routes/index');
const entryRouter = require('./routes/entry');
const profileRouter = require('./routes/profile');
const registerRouter = require('./routes/register');
const articlePageRouter = require('./routes/articlePage');
const usersRouter = require('./routes/users');
const articleVisualRouter = require('./routes/articleVisual');
const loginRouter = require('./routes/login');
const navbarRouter = require('./routes/navbar');

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
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

//transform session
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
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
app.use('/navbar', navbarRouter);
app.use('/entry', entryRouter);
app.use('/profile', profileRouter);
app.use('/articlePage', articlePageRouter);
app.use('/register', registerRouter);
app.use('/users', usersRouter);
app.use('/articleVisual', articleVisualRouter);
app.use('/login', loginRouter);

app.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

// authentication method
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function (email, password, done) {

  console.log("EMAIL:", email);
  console.log("PASSWORD:", password);

  try {
    const user = await db.findUserByEmail(email);
    console.log("USER FOUND:", user);

    if (!user) return done(null, false);

    bcrypt.compare(password, user.Password, function (err, result) {
      console.log("PASSWORD MATCH:", result);

      if (err) return done(err);
      if (result) return done(null, user);
      else return done(null, false);
    });

  } catch (err) {
    console.log(err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.ID);
});

// DESERIALIZE USER
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
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




