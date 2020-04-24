var express = require('express');
var router = express.Router();
var graph = require('../graph');
/* GET home page. */
router.get('/', async function(req, res, next) {
  let params = {
    active: { home: true }
  };
  if (req.cookies.accessToken) {
    params.user = await graph.getUserDetails(req.cookies.accessToken);
    res.render('index', params);
  }
  res.render('index', params);
});

module.exports = router;