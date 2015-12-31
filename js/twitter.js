'use strict'

var link = 'https://api.twitter.com/oauth2/token';

var consumerKey = prompt('Please enter your consumer key');
var consumerSecret = prompt('Please enter your consumerSecret');

// TODO RFC 1738 encoded

var keyAndSecret = consumerKey + ':' + consumerSecret;
var encodedKeyAndSecret = window.btoa(keyAndSecret); // encode a string
var authorizationValue = 'Basic ' + encodedKeyAndSecret;

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
    console.log(xhr.status);
    console.log(xhr.statusText);
  }
};

xhr.open('POST', link, true);
xhr.setRequestHeader('Authorization', authorizationValue);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
xhr.send('grant_type=client_credentials');
