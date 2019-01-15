// Working
var https = require('https');
var fs = require('fs');
var crypto = require('crypto');
var QRS = "4242";
var QPS = "4243";
var utils = require('../utilities/utils');

var certificatesPath = __dirname + '\\' + 'certificates/';
// utils.globalConstDict.getItem("QLIK_APPID")
module.exports = {
  getTicket: function (user, callbackFn) {
    var data = {
      UserDirectory: utils.globalConstDict.getItem("QLIK_USER_DIRECTORY"),
      UserId: user
    }
    this.qPost(QPS, ("/qps/" + "") + "ticket/", data,
      function (err, ticketResponse) {
        if (err) {
          callbackFn(err);
        }
        else {
          var ticket = JSON.parse(ticketResponse);
          if (ticket.Ticket) {
            callbackFn(null, ticket);
          }
          else {
            callbackFn(null);
          }
        }
      });
  },
  generateXrfkey: function (size, chars) {
    size = size || 16;
    chars = chars || 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    var rnd = crypto.randomBytes(size), value = new Array(size), len = chars.length;
    for (var i = 0; i < size; i++) {
      value[i] = chars[rnd[i] % len]
    };
    return value.join('');
  },
  qGet: function (api, url, callbackFn) {
    try {
      var cert = fs.readFileSync(certificatesPath + '/client.pem');
      var key = fs.readFileSync(certificatesPath + '/client_key.pem');
    } catch (e) {
      callbackFn.call(null, 'Missing client certificate');
      return;
    }
    var xrfkey = this.generateXrfkey();

    var settings = {
      method: 'GET',
      proxy:  utils.globalConstDict.getItem("URL_NETWORK_PROXY"),
      headers: {
        'x-qlik-xrfkey': xrfkey,
        'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository'
      },
      key: key,
      cert: cert,
      rejectUnauthorized: false
    };

    if (url.indexOf("http") != -1) {
      settings.host = Url.parse(url).hostname;
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path + '?xrfkey=' + xrfkey;
    }
    else {
      settings.host = "";
      settings.port = api;
      settings.path = url + '?xrfkey=' + xrfkey;
    }
    console.log(settings);
    var data = "";
    https.get(settings, function (response) {
      response.on('data', function (chunk) {
        data += chunk;
      });
      response.on('end', function () {
        callbackFn.call(null, null, data);
      });
    }).on('error', function (e) {
      callbackFn.call(null, e);
    });
  },
  qPost: function (api, url, data, callbackFn) {
    console.log(api);
    try {

      // console.log("certificatesPath:- "+ certificatesPath);
      var cert = fs.readFileSync(certificatesPath + '/client.pem');
      var key = fs.readFileSync(certificatesPath + '/client_key.pem');
    } catch (e) {
      callbackFn.call(null, 'Missing client certificate');
      return;
    }

    // headers: {
    //   'x-qlik-xrfkey': xrfkey,
    //   'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository',
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin': '*'
    // },
    var xrfkey = this.generateXrfkey();

    var settings = {
      proxy:  utils.globalConstDict.getItem("URL_NETWORK_PROXY"),
      method: 'POST',
      headers: {
        'x-qlik-xrfkey': xrfkey,
        'X-Qlik-User': 'UserDirectory=' + utils.globalConstDict.getItem("QLIK_USER_DIRECTORY") + ';UserId=' + utils.globalConstDict.getItem("CONST_MASTER_USERID"),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      key: key,
      cert: cert,
      rejectUnauthorized: false
    };

    if (url.indexOf("http") != -1) {
      settings.host = Url.parse(url).hostname;
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path + '?xrfkey=' + xrfkey;
    }
    else {
      settings.host = utils.globalConstDict.getItem("URL_QLIK_HOST");
      settings.port = api;
      settings.path = url + '?xrfkey=' + xrfkey;
    }
    // console.log(settings);

    var output = "";
    var postReq = https.request(settings, function (postRes) {
      postRes.on('data', function (chunk) {
        output += ("" + chunk);
      });
      postRes.on('end', function () {
        callbackFn.call(null, null, output);
      });
    });
    console.log(JSON.stringify(data));
    postReq.write(JSON.stringify(data));
    postReq.end();

    postReq.on('error', function (e) {
      callbackFn.call(null, e);
    });
  }
};
