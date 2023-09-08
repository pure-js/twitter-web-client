var request = require('request'),
  fs = require('fs');

var authentication = function () {
  var url = 'https://api.twitter.com/oauth2/token';

  var consumerKey = process.argv[2]; // Twitter consumer key
  var consumerSecret = process.argv[3]; // Twitter consumer secret
  var keyAndSecret = consumerKey + ':' + consumerSecret;
  var encodedKeyAndSecret = new Buffer(keyAndSecret).toString('base64'); // encode a string
  var authorizationValue = 'Basic ' + encodedKeyAndSecret;

  var options = {
    url: url,
    method: 'POST',
    headers: {
      Authorization: authorizationValue,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: 'grant_type=client_credentials',
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      isBearer(info);
    }
  }

  var auth = '';

  function isBearer(data) {
    if (data.token_type === 'bearer') {
      auth = 'Bearer ' + data.access_token;
    }
  }

  request(options, callback);

  return auth;
};

var search = function () {
  var url = 'https://api.twitter.com/1.1/search/tweets.json';
  var search_query = 'q=%23wrike';
  var result_type = 'result_type=recent';
  var count = 'count=100';
  var request = url + '?' + search_query + '&' + result_type + '&' + count;

  var authorization = 'Bearer ';

  var options = {
    url: request,
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
  };

  var data = {};

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      fs.writeFile('data.json', info);
      console.log('file is written!');
      console.log(info.statuses[5]);
    } else {
      console.log('error');
    }
  }

  request(options, callback);
};

search();
