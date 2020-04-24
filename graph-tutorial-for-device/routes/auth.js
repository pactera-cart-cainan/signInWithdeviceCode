var express = require('express');
var router = express.Router();
var adal = require('adal-node');
var MemoryCache = require('../lib/memory-cache');
var crypto = require('crypto');
var sampleParameters;
sampleParameters = {
  tenant: '3c33e967-6bae-43fb-80f8-83d093bd41ed',
  authorityHostUrl: 'https://login.windows.net',
  clientId: '2a07af9e-278f-4969-b696-70e1e643ebc2',
  clientSecret: 'r]/jpKb2T0r:u70w-g]-1ff-Q7-pE.W?',
  redirectUri: 'http://localhost:3000/auth/getAToken',
  resource: "00000002-0000-0000-c000-000000000000" //URI of resource where token is valid
};
var AuthenticationContext = require('adal-node').AuthenticationContext;
var templateAuthzUrl = 'https://login.windows.net/' +
  sampleParameters.tenant +
  '/oauth2/authorize?response_type=code&client_id=' +
  sampleParameters.clientId +
  '&redirect_uri=' +
  sampleParameters.redirectUri +
  '&state=<state>&resource=' +
  sampleParameters.resource;
function createAuthorizationUrl(state) {
  return templateAuthzUrl.replace('<state>', state);
}
/* GET auth callback. */
router.get('/signin',
  function (req, res, next) {
    crypto.randomBytes(48, function(ex, buf) {
      var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
  
      res.cookie('authstate', token);
      var authorizationUrl = createAuthorizationUrl(token);
  
      res.redirect(authorizationUrl);
    });
});

router.get('/getAToken', function(req, res) {
  if (req.cookies.authstate !== req.query.state) {
    res.send('error: state does not match');
  }
  var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;
  var authenticationContext = new AuthenticationContext(authorityUrl);

  authenticationContext.acquireTokenWithAuthorizationCode(
    req.query.code,
    sampleParameters.redirectUri,
    sampleParameters.resource,
    sampleParameters.clientId, 
    sampleParameters.clientSecret,
    function(err, response) {
      var errorMessage = '';
      if (err) {
        errorMessage = 'error: ' + err.message + '\n';
      } else {
        errorMessage += 'response: ' + JSON.stringify(response);
        console.log(errorMessage);
        res.cookie('accessToken', response.accessToken);
        res.redirect('/');
      }
    }
  );
});

router.get('/signout',
  function (req, res) {
    req.session.destroy(function (err) {
      res.clearCookie("accessToken");
      res.redirect('/');
    });
  }
);

module.exports = router;