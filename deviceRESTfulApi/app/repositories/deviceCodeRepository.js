const userDeviceInfo = require("../models/userDeviceInfo");
var adal = require('adal-node');
let currentId = 0;
var sampleParameters;
    sampleParameters = {
      tenant: '3c33e967-6bae-43fb-80f8-83d093bd41ed',
      authorityHostUrl: 'https://login.microsoftonline.com/common',
      clientId: '2a07af9e-278f-4969-b696-70e1e643ebc2',
      clientSecret: 'r]/jpKb2T0r:u70w-g]-1ff-Q7-pE.W?',
      resource: '00000002-0000-0000-c000-000000000000'
    };
class deviceCodeRepository {
  constructor(req, res) {
  }

  async getDeviceCode(req, res) {
    
    try {
      var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;
      var context = new adal.AuthenticationContext(authorityUrl, null);
      context.acquireUserCode(sampleParameters.resource, sampleParameters.clientId, 'es-mx', function (err, response) {
        if (err) {
          console.log('well that didn\'t work: ' + err.stack);
          res.json(err);
        } else {
          console.log(response);
          res.json(response);
        }
      });
    } catch (err) {
      req.flash('error_msg', {
        message: 'Could not get access token. Try signing out and signing in again.',
        debug: JSON.stringify(err)
      });
    }
  }

  async postDeviceCode(req, res) {
    try {
      var authorityUrl = req.body.authorityHostUrl + '/' + req.body.tenant;
      var context = new adal.AuthenticationContext(authorityUrl, null);
      context.acquireUserCode(req.body.resource, req.body.clientId, 'es-mx', function (err, response) {
        if (err) {
          console.log('well that didn\'t work: ' + err.stack);
          res.json(err);
        } else {
          console.log(response);
          res.json(response);
        }
      });
    } catch (err) {
      req.flash('error_msg', {
        message: 'Could not get access token. Try signing out and signing in again.',
        debug: JSON.stringify(err)
      });
    }
  }

  async getToken(req, res) {
    var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;

    var context = new adal.AuthenticationContext(authorityUrl, null);
    context.acquireTokenWithDeviceCode(sampleParameters.resource, sampleParameters.clientId, req.body, function (err, tokenResponse) {
        if (err) {
            console.log(err);
            req.flash('error_msg', {
                message: 'Could not get access token. Try signing out and signing in again.',
                debug: JSON.stringify(err)
              });
        }
        else {
            console.log(tokenResponse);
            context.acquireTokenWithClientCredentials(
              'https://graph.microsoft.com',
              sampleParameters.clientId,
              sampleParameters.clientSecret,
              function (err, tokenResponse) {
                if (err) {
                  console.log('well that didn\'t work: ' + err.stack);
                } else {
                  if (tokenResponse.accessToken && tokenResponse.accessToken.length > 0) {
                    res.json(tokenResponse);
                  }
                }
            });
        }
    });
  }
}

module.exports = new deviceCodeRepository();