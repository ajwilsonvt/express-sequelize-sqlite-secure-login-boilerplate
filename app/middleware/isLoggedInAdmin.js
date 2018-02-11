module.exports = (req, res, next) => {
  console.log('req.session', req.session);
  if (!req.user.admin) {
    req.flash('error', 'You are not authorized to access that page');
    res.redirect('/');
  } else {
    next();
  }
};
