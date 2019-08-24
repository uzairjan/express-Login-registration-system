var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',{name: req.user.name }) );

module.exports = router;
