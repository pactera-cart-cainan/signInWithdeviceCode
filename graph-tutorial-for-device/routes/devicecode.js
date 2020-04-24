var express = require('express');
var router = express.Router();
var http = require('http');

/* GET /devicecode */
router.get('/',
  async function (req, res) {

    try {
      let params = {
        active: { devicecode: true }
      };

      // the options  
      var options = {
        host: 'localhost',
        port: '5000',
        path: '/getDeviceCode',
        method: 'GET'
      };

      // do the GET call   
      var resPost = http.request(options, function (resPost) {
        resPost.on('data', function(result) { 
          //res.json(data);
          var data = JSON.parse(result.toString());
          params.userCode = data.userCode;
          params.deviceCode = data.deviceCode;
          params.verificationUrl = data.verificationUrl;
          res.cookie('userCodeInfo', result.toString());
          res.render('devicecode', params);
  
        });
      });
      resPost.end();

      resPost.on('error', function (e) {
        console.error(e);
      });

    } catch (err) {
      req.flash('error_msg', {
        message: 'Could not get access token. Try signing out and signing in again.',
        debug: JSON.stringify(err)
      });
    }
  });

router.get('/callback',
  async function (req, res, next) {
    // let params = {
    //   active: { devicecode: true }
    //   ,
    //   user: {}
    // };
    var postheaders = {  
      'Content-Type' : 'application/json; charset=UTF-8',  
      'Content-Length' : Buffer.byteLength(req.cookies.userCodeInfo, 'utf8')  
    };  
    var optionsPost = {
      host: 'localhost',
      port: '5000',
      path: '/getToken',
      method: 'POST',
      headers : postheaders 
    };
    var resPost2 = http.request(optionsPost, function (resPost2) {
      resPost2.on('data', function(result) { 
        var data = JSON.parse(result.toString()); 
        res.cookie('accessToken', data.accessToken);
        res.clearCookie("userCodeInfo");
        res.redirect('/');
      });
    });
    resPost2.write(req.cookies.userCodeInfo); 
    resPost2.end();

    resPost2.on('error', function (e) {
      console.error(e);
    });
  });
module.exports = router;


