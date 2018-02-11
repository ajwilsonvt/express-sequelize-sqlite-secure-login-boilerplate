const express = require('express');
const db = require('../../models');
// const passport = require('../../config/ppConfig');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  db.user.findAll()
    .then(users => res.json({ users }))
    .catch(error => res.status(500).json({ error: error.message }));
});

module.exports = router;
