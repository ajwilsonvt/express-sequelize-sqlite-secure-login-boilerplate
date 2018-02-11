const express = require('express');
const db = require('../models');
const passport = require('../config/ppConfig');

const router = express.Router();

function errorHandle(req, user) {
  if (user.email === req.body.email) {
    req.flash('error', 'Email already exists');
  } else if (user.username === req.body.username) {
    req.flash('error', 'Username already exists');
  } else {
    req.flash('error', 'User already exists');
  }
}

/* Sign Up view. */
router.get('/signup', (req, res) => {
  res.render('signup');
});

/* Sign Up POST route. */
router.post('/signup', (req, res) => {
  db.user.findOrCreate({
    where: {
      $or: [
        { email: req.body.email },
        { username: req.body.username },
      ],
    },
    defaults: req.body,
  })
    .spread((user, created) => {
      if (created) {
        passport.authenticate('local', {
          successRedirect: '/profile',
          successFlash: 'Account created and logged in',
        })(req, res);
      } else {
        errorHandle(req, user);
        res.redirect('/auth/signup');
      }
    })
    .catch((error) => {
      req.flash('error', error.message);
      res.redirect('/auth/signup');
    });
});

/* Log In view. */
router.get('/login', (req, res) => {
  res.render('login');
});

/* Log In POST route. */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/auth/login',
  successFlash: 'You have logged in',
  failureFlash: 'Invalid username and/ or password',
}));

/* Log Out GET route */
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

module.exports = router;
