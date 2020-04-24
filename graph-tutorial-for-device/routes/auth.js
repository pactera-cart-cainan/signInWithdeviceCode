var express = require('express');
var passport = require('passport');
var router = express.Router();
var adal = require('adal-node');
var MemoryCache = require('../lib/memory-cache');

/* GET auth callback. */
// router.get('/signin',
//   function  (req, res, next) {
//     passport.authenticate('azuread-openidconnect',
//       {
//         response: res,
//         prompt: 'login',
//         failureRedirect: '/',
//         failureFlash: true,
//         successRedirect: '/'
//       }
//     )(req,res,next);
//   }
// );

// router.post('/callback',
//   function(req, res, next) {
//     passport.authenticate('azuread-openidconnect',
//       {
//         response: res,
//         failureRedirect: '/',
//         failureFlash: true,
//         successRedirect: '/'
//       }
//     )(req,res,next);
//   },
//   function(req, res) {
//     // TEMPORARY!
//     // Flash the access token for testing purposes
//     req.flash('error_msg', {message: 'Access token', debug: req.user.accessToken});
//     res.redirect('/');
//   }
// );

router.get('/signout',
  function(req, res) {
    req.session.destroy(function(err) {
      res.clearCookie("accessToken");
      res.redirect('/');
    });
  }
);

module.exports = router;