var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');

/* GET /calendar */
router.get('/',
  async function(req, res) {
    let params = {
      active: { calendar: true }
    };
    var accessToken = req.cookies.accessToken;
    if (accessToken && accessToken.length > 0) {
      try {
        // Get the events
        var events = await graph.getEvents(accessToken);
        params.events = events.value;
        res.render('calendar', params);
      } catch (err) {
          req.flash('error_msg', {
              message: 'Could not fetch events',
              debug: JSON.stringify(err)
            });
      }
    } else {
      res.redirect('/');
    } 
  }
);

module.exports = router;