const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index');
});

/* GET profile page. */
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;
