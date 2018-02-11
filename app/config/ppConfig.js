const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  db.user.findById(id)
    .then(user => done(null, user))
    .catch(done);
});

/**
 * Setup passport to use LocalStrategy.
 */

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  db.user.find({ where: { email } })
    .then((user) => {
      if (!user || !user.validPassword(password)) {
        done(null, false);
      } else {
        done(null, user);
      }
    })
    .catch(done);
}));

module.exports = passport;
